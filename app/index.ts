import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'
export type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
}

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDVD7OQOQZ36RFWMYLP5ROXYHSLQHCMN75ARPGPJD5HC4QNQHJN6LSWK",
  }
} as const


export interface EncryptedDocument {
  created_at: u64;
  encrypted_content: Buffer;
  encrypted_metadata: Option<Buffer>;
  id: u32;
  name: string;
  owner: string;
  tags: Array<string>;
  updated_at: u64;
}

export interface Client {
  /**
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the contract
   */
  init: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a store_document transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Store a new encrypted document
   * Returns the document_id that was assigned
   */
  store_document: ({ owner, encrypted_content, name, encrypted_metadata, tags }: { owner: string, encrypted_content: Buffer, name: string, encrypted_metadata: Option<Buffer>, tags: Array<string> }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a get_document transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get a specific document by ID
   */
  get_document: ({ owner, document_id }: { owner: string, document_id: u32 }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<EncryptedDocument>>>

  /**
   * Construct and simulate a get_user_documents transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all documents for a specific owner
   */
  get_user_documents: ({ owner }: { owner: string }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<EncryptedDocument>>>

  /**
   * Construct and simulate a update_document transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update an existing document
   */
  update_document: ({ owner, document_id, encrypted_content, name, encrypted_metadata, tags }: { owner: string, document_id: u32, encrypted_content: Option<Buffer>, name: Option<string>, encrypted_metadata: Option<Buffer>, tags: Option<Array<string>> }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a delete_document transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Delete a specific document
   */
  delete_document: ({ owner, document_id }: { owner: string, document_id: u32 }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_documents_by_tags transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get documents by tags (filter documents that contain any of the specified tags)
   */
  get_documents_by_tags: ({ owner, search_tags }: { owner: string, search_tags: Array<string> }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<EncryptedDocument>>>

  /**
   * Construct and simulate a get_document_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get document count for a user
   */
  get_document_count: ({ owner }: { owner: string }, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec(["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"]),
      options
    )
  }
  public readonly fromJSON = {
    init: this.txFromJSON<null>,
    store_document: this.txFromJSON<u32>,
    get_document: this.txFromJSON<Option<EncryptedDocument>>,
    get_user_documents: this.txFromJSON<Array<EncryptedDocument>>,
    update_document: this.txFromJSON<boolean>,
    delete_document: this.txFromJSON<boolean>,
    get_documents_by_tags: this.txFromJSON<Array<EncryptedDocument>>,
    get_document_count: this.txFromJSON<u32>
  }
}