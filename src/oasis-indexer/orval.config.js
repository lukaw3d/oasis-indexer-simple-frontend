/** @type {import('@orval/core').Config} */
module.exports = {
  indexer: {
    input: {
      // target: './v1.yaml',
      // target: 'https://raw.githubusercontent.com/oasisprotocol/nexus/main/api/spec/v1.yaml',
      // target: 'https://nexus.prd.oasis.io/v1/spec/v1.yaml',
      target: 'https://nexus.oasis.io/v1/spec/v1.yaml',
    },
    output: {
      target: './generated/api.ts',
      client: 'react-query',
      mode: 'single',
      override: {
        mutator: './largePages.ts',
      },
    },
  },
}
