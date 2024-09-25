const { Console } = require("console");
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

server.once("message", (msg, rinfo) => {
  const data = msg.toString().split(",");

  // Parsing the client request
  const requestType = data[0];
  const partitionNumber = parseInt(data[1]);
  const rangeStart = parseInt(data[2]);
  const rangeEnd = parseInt(data[3]);
  const n = parseInt(data[4]);
  const t = parseInt(data[5]);

  console.log(
    `Received ${requestType} for partition ${partitionNumber + 1} from ${
      rinfo.address
    }: ${rinfo.port}`
  );
  console.log(
    `Partition details - Range Start: ${rangeStart}, Range End: ${rangeEnd}, Total Terms (n): ${n}, Exponentiation (t): ${t}`
  );

  // Compute the sum
  let partitionSum = 0;
  for (let i = rangeStart; i <= rangeEnd; i++) {
    partitionSum += Math.pow(i, t);
    console.log(`Computing: ${i}^${t} = ${Math.pow(i, t)}`);
  }
  console.log(
    `Computed partition sum for partition ${partitionNumber + 1}: ${partitionSum}`
  );

  const replyMessage = `REPLY,${partitionNumber},${rangeStart},${rangeEnd},${n},${t},${partitionSum}`;

  // Send the response back to the client
  server.send(replyMessage, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error("Error sending response:", err);
    } else {
      console.log(
        `Sent response to client for partition ${partitionNumber + 1}: ${replyMessage}`
      );
      console.log();
      console.log("----------------------------------------");
      console.log();
    }
  });
});

server.on("error", (err) => {
  console.error(`Server error:\n${err.stack}`);
  server.close();
});

server.on("listening", () => {
  const address = server.address();
  console.log(`Server listening on ${address.address}: ${address.port}`);
});

// Server listens on port 5004
server.bind(5004);
