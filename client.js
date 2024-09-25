const dgram = require("dgram");
const client = dgram.createSocket("udp4");

function sendRequest(
  serverAddress,
  serverPort,
  startRange,
  endRange,
  t,
  n,
  partitionNumber
) {
  return new Promise((resolve, reject) => {
    const message = `REQUEST,${partitionNumber},${startRange},${endRange},${n},${t}`;
    client.send(message, serverPort, serverAddress, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log(
          `Request sent to server ${partitionNumber + 1}: ${message}`
        );
      }
    });

    // Listen for a response from the server
    client.once("message", (msg, info) => {
      try {
        const data = msg.toString().split(",");
        const partitionSum = parseInt(data[6]);
        console.log(
          `Received response from server ${partitionNumber + 1}: ${data}`
        );
        resolve(partitionSum);
      } catch (error) {
        reject(new Error("Failed to parse server response."));
      }
    });
  });
}

async function main() {
  const n = 10; // Total number of terms
  const t = 2; // Exponentiation value
  const partitionSize = n / 5;

  const serverAddress = "localhost";
  const serverPorts = [5001, 5002, 5003, 5004, 5005];

  let totalSum = 0;

  try {
    for (let i = 0; i < 5; i++) {
      const partitionRange = [i * partitionSize, (i + 1) * partitionSize - 1];
      console.log(
        `Calculating partition range for server ${i + 1}: ${
          partitionRange[0]
        } to ${partitionRange[1]}`
      );
      const partitionSum = await sendRequest(
        serverAddress,
        serverPorts[i],
        partitionRange[0],
        partitionRange[1],
        t,
        n,
        i
      );
      console.log(
        `Partition sum received from server ${i + 1}: ${partitionSum}`
      );
      console.log();
      console.log("-----------------------------------------");
      console.log();
      totalSum += partitionSum;
    }

    console.log(`Final total sum computed: ${totalSum}`);
  } catch (error) {
    console.error("Error occurred:", error.message);
  } finally {
    client.close(); // Ensure the client socket is closed after all requests
    console.log("Client socket closed.");
  }
}

main();
