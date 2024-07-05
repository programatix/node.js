# Introduction
This repository is an example to automatic generate OpenAPI documentation (see https://swagger.io/specification/).

## Sample servers
Sample servers are provided, placed in folders with the format, `server-[package]`, where the `[package]` represent the library used to perform the OpenAPI documentation generation.

- `server-swagger-jsdoc`
  - https://github.com/Surnet/swagger-jsdoc
- `server-tspec`
  - https://github.com/ts-spec/tspec

## Test Tools
### HTTP
.http test scripts are located in ./tests

### Flashpost
Flashpost (https://github.com/subasraj/flashpost-support/tree/main), a VS Code extension enables you to develop and test your REST APIs directly from Visual Studio Code.

Flashpost test scripts are located in ./Flashpost-tests

### Bruno
Bruno (https://www.usebruno.com/) is a Fast and Git-Friendly Opensource API client, aimed at revolutionizing the status quo represented by Postman, Insomnia and similar tools out there.

Bruno test scripts are located in ./tests/bruno