import { CliqueClient, Contract, Script } from 'alephium-web3'

const client = new CliqueClient({ baseUrl: 'http://127.0.0.1:22973' })
Contract.fromSource(client, 'voting.ral')
Script.fromSource(client, 'token_allocation.ral')
Script.fromSource(client, 'voting_script.ral')
Script.fromSource(client, 'closing_script.ral')
