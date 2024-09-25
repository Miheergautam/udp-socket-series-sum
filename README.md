# Assignment 1: Math Series Sum Calculation Using Client-Server Computing

## Overview

This project involves computing the sum of a mathematical series of the form:

\[ S = 0^t + 1^t + 2^t + ... + (n-1)^t \]

using a client-server architecture. The calculation distributes the workload across five servers, allowing for efficient computation and utilization of resources.

## Problem Statement

Given a non-negative integer \( t \) and an integer \( n \) that can be 100, 200, 300, 400, or 500, the objective is to:

1. Compute the sum \( S \) by partitioning the series into five equal segments.
2. Each server will handle the computation for its designated partition.
3. The client aggregates the results from all servers to obtain the final sum.

## Distribution of Work

Each server computes the sum for its assigned partition based on the formula:

\[
\text{Sum for partition } p = \sum_{i=(n/5)p}^{(n/5)(p+1)-1} i^t
\]

where \( p = 0, 1, 2, 3, 4 \).

## Request and Reply Packet Layout

### Request Packet Layout

When a client sends a request to a server, the packet structure is as follows:

1. **Request Type**: `REQUEST`
2. **Function Number**: [To be defined]
3. **Partition Number**: `p`
4. **Range Start**: Starting range of terms
5. **Range End**: Ending range of terms
6. **Total Terms (n)**: Total number of terms
7. **Exponentiation (t)**: Value of t

### Reply Packet Layout

When a server responds to a client, the packet structure is as follows:

1. **Response Type**: `REPLY`
2. **Function Number**: [To be defined]
3. **Partition Number**: `p`
4. **Number of Terms**: Total number of terms processed
5. **Total Terms (n)**: Total number of terms
6. **Exponentiation (t)**: Value of t
7. **Sum of Partition**: Computed sum for the partition
8. **Include/Exclude Terms (I/X)**: [To be defined]
9. **Terms Details**: Detailed computation terms for verification

## Server Responsibilities

Upon receiving a client request, the server must:

1. Decode the request to determine its assigned partition.
2. Compute the sum for the given partition.
3. Encode the results into the reply packet.
4. Include necessary values (n, t, and p) in the response.
5. Send the result back to the client.

## Client Responsibilities

The client will:

1. Send requests to each server with appropriate parameters.
2. Wait for all servers to respond with their respective results.
3. Aggregate the results to compute the final sum.
4. Print the total sum, the number of terms, and the exponentiation value.

## Implementation Details

- **Protocol**: UDP sockets are used for communication between the client and servers.
- **Programming Language**: JavaScript (Node.js).

## How to Run the Project

1. Ensure Node.js is installed on your machine.
2. Start each server in a separate terminal window:
   ```bash
   node server1.js
   node server2.js
   node server3.js
   node server4.js
   node server5.js