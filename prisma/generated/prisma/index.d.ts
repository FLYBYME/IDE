
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Extension
 * 
 */
export type Extension = $Result.DefaultSelection<Prisma.$ExtensionPayload>
/**
 * Model ExtensionVersion
 * 
 */
export type ExtensionVersion = $Result.DefaultSelection<Prisma.$ExtensionVersionPayload>
/**
 * Model UserExtension
 * 
 */
export type UserExtension = $Result.DefaultSelection<Prisma.$UserExtensionPayload>
/**
 * Model Workspace
 * 
 */
export type Workspace = $Result.DefaultSelection<Prisma.$WorkspacePayload>
/**
 * Model WorkspaceSecret
 * 
 */
export type WorkspaceSecret = $Result.DefaultSelection<Prisma.$WorkspaceSecretPayload>
/**
 * Model UserSettings
 * 
 */
export type UserSettings = $Result.DefaultSelection<Prisma.$UserSettingsPayload>
/**
 * Model WorkspaceSettings
 * 
 */
export type WorkspaceSettings = $Result.DefaultSelection<Prisma.$WorkspaceSettingsPayload>
/**
 * Model EditorState
 * 
 */
export type EditorState = $Result.DefaultSelection<Prisma.$EditorStatePayload>
/**
 * Model TabState
 * 
 */
export type TabState = $Result.DefaultSelection<Prisma.$TabStatePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.extension`: Exposes CRUD operations for the **Extension** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Extensions
    * const extensions = await prisma.extension.findMany()
    * ```
    */
  get extension(): Prisma.ExtensionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.extensionVersion`: Exposes CRUD operations for the **ExtensionVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExtensionVersions
    * const extensionVersions = await prisma.extensionVersion.findMany()
    * ```
    */
  get extensionVersion(): Prisma.ExtensionVersionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userExtension`: Exposes CRUD operations for the **UserExtension** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserExtensions
    * const userExtensions = await prisma.userExtension.findMany()
    * ```
    */
  get userExtension(): Prisma.UserExtensionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workspace`: Exposes CRUD operations for the **Workspace** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Workspaces
    * const workspaces = await prisma.workspace.findMany()
    * ```
    */
  get workspace(): Prisma.WorkspaceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workspaceSecret`: Exposes CRUD operations for the **WorkspaceSecret** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkspaceSecrets
    * const workspaceSecrets = await prisma.workspaceSecret.findMany()
    * ```
    */
  get workspaceSecret(): Prisma.WorkspaceSecretDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userSettings`: Exposes CRUD operations for the **UserSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSettings
    * const userSettings = await prisma.userSettings.findMany()
    * ```
    */
  get userSettings(): Prisma.UserSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workspaceSettings`: Exposes CRUD operations for the **WorkspaceSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkspaceSettings
    * const workspaceSettings = await prisma.workspaceSettings.findMany()
    * ```
    */
  get workspaceSettings(): Prisma.WorkspaceSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.editorState`: Exposes CRUD operations for the **EditorState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EditorStates
    * const editorStates = await prisma.editorState.findMany()
    * ```
    */
  get editorState(): Prisma.EditorStateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tabState`: Exposes CRUD operations for the **TabState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TabStates
    * const tabStates = await prisma.tabState.findMany()
    * ```
    */
  get tabState(): Prisma.TabStateDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.1
   * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Extension: 'Extension',
    ExtensionVersion: 'ExtensionVersion',
    UserExtension: 'UserExtension',
    Workspace: 'Workspace',
    WorkspaceSecret: 'WorkspaceSecret',
    UserSettings: 'UserSettings',
    WorkspaceSettings: 'WorkspaceSettings',
    EditorState: 'EditorState',
    TabState: 'TabState'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "extension" | "extensionVersion" | "userExtension" | "workspace" | "workspaceSecret" | "userSettings" | "workspaceSettings" | "editorState" | "tabState"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Extension: {
        payload: Prisma.$ExtensionPayload<ExtArgs>
        fields: Prisma.ExtensionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExtensionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExtensionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionPayload>
          }
          findFirst: {
            args: Prisma.ExtensionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExtensionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionPayload>
          }
          findMany: {
            args: Prisma.ExtensionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionPayload>[]
          }
          create: {
            args: Prisma.ExtensionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionPayload>
          }
          createMany: {
            args: Prisma.ExtensionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExtensionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionPayload>[]
          }
          delete: {
            args: Prisma.ExtensionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionPayload>
          }
          update: {
            args: Prisma.ExtensionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionPayload>
          }
          deleteMany: {
            args: Prisma.ExtensionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExtensionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExtensionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionPayload>[]
          }
          upsert: {
            args: Prisma.ExtensionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionPayload>
          }
          aggregate: {
            args: Prisma.ExtensionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExtension>
          }
          groupBy: {
            args: Prisma.ExtensionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExtensionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExtensionCountArgs<ExtArgs>
            result: $Utils.Optional<ExtensionCountAggregateOutputType> | number
          }
        }
      }
      ExtensionVersion: {
        payload: Prisma.$ExtensionVersionPayload<ExtArgs>
        fields: Prisma.ExtensionVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExtensionVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExtensionVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionVersionPayload>
          }
          findFirst: {
            args: Prisma.ExtensionVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExtensionVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionVersionPayload>
          }
          findMany: {
            args: Prisma.ExtensionVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionVersionPayload>[]
          }
          create: {
            args: Prisma.ExtensionVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionVersionPayload>
          }
          createMany: {
            args: Prisma.ExtensionVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExtensionVersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionVersionPayload>[]
          }
          delete: {
            args: Prisma.ExtensionVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionVersionPayload>
          }
          update: {
            args: Prisma.ExtensionVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionVersionPayload>
          }
          deleteMany: {
            args: Prisma.ExtensionVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExtensionVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExtensionVersionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionVersionPayload>[]
          }
          upsert: {
            args: Prisma.ExtensionVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExtensionVersionPayload>
          }
          aggregate: {
            args: Prisma.ExtensionVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExtensionVersion>
          }
          groupBy: {
            args: Prisma.ExtensionVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExtensionVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExtensionVersionCountArgs<ExtArgs>
            result: $Utils.Optional<ExtensionVersionCountAggregateOutputType> | number
          }
        }
      }
      UserExtension: {
        payload: Prisma.$UserExtensionPayload<ExtArgs>
        fields: Prisma.UserExtensionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserExtensionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserExtensionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserExtensionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserExtensionPayload>
          }
          findFirst: {
            args: Prisma.UserExtensionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserExtensionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserExtensionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserExtensionPayload>
          }
          findMany: {
            args: Prisma.UserExtensionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserExtensionPayload>[]
          }
          create: {
            args: Prisma.UserExtensionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserExtensionPayload>
          }
          createMany: {
            args: Prisma.UserExtensionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserExtensionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserExtensionPayload>[]
          }
          delete: {
            args: Prisma.UserExtensionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserExtensionPayload>
          }
          update: {
            args: Prisma.UserExtensionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserExtensionPayload>
          }
          deleteMany: {
            args: Prisma.UserExtensionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserExtensionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserExtensionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserExtensionPayload>[]
          }
          upsert: {
            args: Prisma.UserExtensionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserExtensionPayload>
          }
          aggregate: {
            args: Prisma.UserExtensionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserExtension>
          }
          groupBy: {
            args: Prisma.UserExtensionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserExtensionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserExtensionCountArgs<ExtArgs>
            result: $Utils.Optional<UserExtensionCountAggregateOutputType> | number
          }
        }
      }
      Workspace: {
        payload: Prisma.$WorkspacePayload<ExtArgs>
        fields: Prisma.WorkspaceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkspaceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkspaceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          findFirst: {
            args: Prisma.WorkspaceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkspaceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          findMany: {
            args: Prisma.WorkspaceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          create: {
            args: Prisma.WorkspaceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          createMany: {
            args: Prisma.WorkspaceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkspaceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          delete: {
            args: Prisma.WorkspaceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          update: {
            args: Prisma.WorkspaceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          deleteMany: {
            args: Prisma.WorkspaceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkspaceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkspaceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          upsert: {
            args: Prisma.WorkspaceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          aggregate: {
            args: Prisma.WorkspaceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkspace>
          }
          groupBy: {
            args: Prisma.WorkspaceGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkspaceCountArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceCountAggregateOutputType> | number
          }
        }
      }
      WorkspaceSecret: {
        payload: Prisma.$WorkspaceSecretPayload<ExtArgs>
        fields: Prisma.WorkspaceSecretFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkspaceSecretFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSecretPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkspaceSecretFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSecretPayload>
          }
          findFirst: {
            args: Prisma.WorkspaceSecretFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSecretPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkspaceSecretFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSecretPayload>
          }
          findMany: {
            args: Prisma.WorkspaceSecretFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSecretPayload>[]
          }
          create: {
            args: Prisma.WorkspaceSecretCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSecretPayload>
          }
          createMany: {
            args: Prisma.WorkspaceSecretCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkspaceSecretCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSecretPayload>[]
          }
          delete: {
            args: Prisma.WorkspaceSecretDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSecretPayload>
          }
          update: {
            args: Prisma.WorkspaceSecretUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSecretPayload>
          }
          deleteMany: {
            args: Prisma.WorkspaceSecretDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkspaceSecretUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkspaceSecretUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSecretPayload>[]
          }
          upsert: {
            args: Prisma.WorkspaceSecretUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSecretPayload>
          }
          aggregate: {
            args: Prisma.WorkspaceSecretAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkspaceSecret>
          }
          groupBy: {
            args: Prisma.WorkspaceSecretGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceSecretGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkspaceSecretCountArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceSecretCountAggregateOutputType> | number
          }
        }
      }
      UserSettings: {
        payload: Prisma.$UserSettingsPayload<ExtArgs>
        fields: Prisma.UserSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>
          }
          findFirst: {
            args: Prisma.UserSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>
          }
          findMany: {
            args: Prisma.UserSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>[]
          }
          create: {
            args: Prisma.UserSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>
          }
          createMany: {
            args: Prisma.UserSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>[]
          }
          delete: {
            args: Prisma.UserSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>
          }
          update: {
            args: Prisma.UserSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>
          }
          deleteMany: {
            args: Prisma.UserSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>[]
          }
          upsert: {
            args: Prisma.UserSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSettingsPayload>
          }
          aggregate: {
            args: Prisma.UserSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserSettings>
          }
          groupBy: {
            args: Prisma.UserSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<UserSettingsCountAggregateOutputType> | number
          }
        }
      }
      WorkspaceSettings: {
        payload: Prisma.$WorkspaceSettingsPayload<ExtArgs>
        fields: Prisma.WorkspaceSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkspaceSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkspaceSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSettingsPayload>
          }
          findFirst: {
            args: Prisma.WorkspaceSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkspaceSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSettingsPayload>
          }
          findMany: {
            args: Prisma.WorkspaceSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSettingsPayload>[]
          }
          create: {
            args: Prisma.WorkspaceSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSettingsPayload>
          }
          createMany: {
            args: Prisma.WorkspaceSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkspaceSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSettingsPayload>[]
          }
          delete: {
            args: Prisma.WorkspaceSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSettingsPayload>
          }
          update: {
            args: Prisma.WorkspaceSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSettingsPayload>
          }
          deleteMany: {
            args: Prisma.WorkspaceSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkspaceSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkspaceSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSettingsPayload>[]
          }
          upsert: {
            args: Prisma.WorkspaceSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspaceSettingsPayload>
          }
          aggregate: {
            args: Prisma.WorkspaceSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkspaceSettings>
          }
          groupBy: {
            args: Prisma.WorkspaceSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkspaceSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceSettingsCountAggregateOutputType> | number
          }
        }
      }
      EditorState: {
        payload: Prisma.$EditorStatePayload<ExtArgs>
        fields: Prisma.EditorStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EditorStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EditorStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EditorStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EditorStatePayload>
          }
          findFirst: {
            args: Prisma.EditorStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EditorStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EditorStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EditorStatePayload>
          }
          findMany: {
            args: Prisma.EditorStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EditorStatePayload>[]
          }
          create: {
            args: Prisma.EditorStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EditorStatePayload>
          }
          createMany: {
            args: Prisma.EditorStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EditorStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EditorStatePayload>[]
          }
          delete: {
            args: Prisma.EditorStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EditorStatePayload>
          }
          update: {
            args: Prisma.EditorStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EditorStatePayload>
          }
          deleteMany: {
            args: Prisma.EditorStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EditorStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EditorStateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EditorStatePayload>[]
          }
          upsert: {
            args: Prisma.EditorStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EditorStatePayload>
          }
          aggregate: {
            args: Prisma.EditorStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEditorState>
          }
          groupBy: {
            args: Prisma.EditorStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<EditorStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.EditorStateCountArgs<ExtArgs>
            result: $Utils.Optional<EditorStateCountAggregateOutputType> | number
          }
        }
      }
      TabState: {
        payload: Prisma.$TabStatePayload<ExtArgs>
        fields: Prisma.TabStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TabStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TabStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TabStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TabStatePayload>
          }
          findFirst: {
            args: Prisma.TabStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TabStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TabStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TabStatePayload>
          }
          findMany: {
            args: Prisma.TabStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TabStatePayload>[]
          }
          create: {
            args: Prisma.TabStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TabStatePayload>
          }
          createMany: {
            args: Prisma.TabStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TabStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TabStatePayload>[]
          }
          delete: {
            args: Prisma.TabStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TabStatePayload>
          }
          update: {
            args: Prisma.TabStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TabStatePayload>
          }
          deleteMany: {
            args: Prisma.TabStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TabStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TabStateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TabStatePayload>[]
          }
          upsert: {
            args: Prisma.TabStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TabStatePayload>
          }
          aggregate: {
            args: Prisma.TabStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTabState>
          }
          groupBy: {
            args: Prisma.TabStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<TabStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.TabStateCountArgs<ExtArgs>
            result: $Utils.Optional<TabStateCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    extension?: ExtensionOmit
    extensionVersion?: ExtensionVersionOmit
    userExtension?: UserExtensionOmit
    workspace?: WorkspaceOmit
    workspaceSecret?: WorkspaceSecretOmit
    userSettings?: UserSettingsOmit
    workspaceSettings?: WorkspaceSettingsOmit
    editorState?: EditorStateOmit
    tabState?: TabStateOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    workspaces: number
    extensions: number
    userExtensions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspaces?: boolean | UserCountOutputTypeCountWorkspacesArgs
    extensions?: boolean | UserCountOutputTypeCountExtensionsArgs
    userExtensions?: boolean | UserCountOutputTypeCountUserExtensionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWorkspacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountExtensionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExtensionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUserExtensionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserExtensionWhereInput
  }


  /**
   * Count Type ExtensionCountOutputType
   */

  export type ExtensionCountOutputType = {
    versions: number
    installations: number
  }

  export type ExtensionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    versions?: boolean | ExtensionCountOutputTypeCountVersionsArgs
    installations?: boolean | ExtensionCountOutputTypeCountInstallationsArgs
  }

  // Custom InputTypes
  /**
   * ExtensionCountOutputType without action
   */
  export type ExtensionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionCountOutputType
     */
    select?: ExtensionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExtensionCountOutputType without action
   */
  export type ExtensionCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExtensionVersionWhereInput
  }

  /**
   * ExtensionCountOutputType without action
   */
  export type ExtensionCountOutputTypeCountInstallationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserExtensionWhereInput
  }


  /**
   * Count Type ExtensionVersionCountOutputType
   */

  export type ExtensionVersionCountOutputType = {
    installations: number
  }

  export type ExtensionVersionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    installations?: boolean | ExtensionVersionCountOutputTypeCountInstallationsArgs
  }

  // Custom InputTypes
  /**
   * ExtensionVersionCountOutputType without action
   */
  export type ExtensionVersionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersionCountOutputType
     */
    select?: ExtensionVersionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExtensionVersionCountOutputType without action
   */
  export type ExtensionVersionCountOutputTypeCountInstallationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserExtensionWhereInput
  }


  /**
   * Count Type WorkspaceCountOutputType
   */

  export type WorkspaceCountOutputType = {
    secrets: number
  }

  export type WorkspaceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    secrets?: boolean | WorkspaceCountOutputTypeCountSecretsArgs
  }

  // Custom InputTypes
  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceCountOutputType
     */
    select?: WorkspaceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountSecretsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceSecretWhereInput
  }


  /**
   * Count Type EditorStateCountOutputType
   */

  export type EditorStateCountOutputType = {
    tabs: number
  }

  export type EditorStateCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tabs?: boolean | EditorStateCountOutputTypeCountTabsArgs
  }

  // Custom InputTypes
  /**
   * EditorStateCountOutputType without action
   */
  export type EditorStateCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorStateCountOutputType
     */
    select?: EditorStateCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EditorStateCountOutputType without action
   */
  export type EditorStateCountOutputTypeCountTabsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TabStateWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    passwordHash: string | null
    role: string | null
    isActive: boolean | null
    lastLogin: Date | null
    bio: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    passwordHash: string | null
    role: string | null
    isActive: boolean | null
    lastLogin: Date | null
    bio: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    passwordHash: number
    role: number
    isActive: number
    lastLogin: number
    bio: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    role?: true
    isActive?: true
    lastLogin?: true
    bio?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    role?: true
    isActive?: true
    lastLogin?: true
    bio?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    role?: true
    isActive?: true
    lastLogin?: true
    bio?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    username: string
    passwordHash: string
    role: string
    isActive: boolean
    lastLogin: Date | null
    bio: string | null
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    role?: boolean
    isActive?: boolean
    lastLogin?: boolean
    bio?: boolean
    createdAt?: boolean
    workspaces?: boolean | User$workspacesArgs<ExtArgs>
    settings?: boolean | User$settingsArgs<ExtArgs>
    extensions?: boolean | User$extensionsArgs<ExtArgs>
    userExtensions?: boolean | User$userExtensionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    role?: boolean
    isActive?: boolean
    lastLogin?: boolean
    bio?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    role?: boolean
    isActive?: boolean
    lastLogin?: boolean
    bio?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    role?: boolean
    isActive?: boolean
    lastLogin?: boolean
    bio?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "username" | "passwordHash" | "role" | "isActive" | "lastLogin" | "bio" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspaces?: boolean | User$workspacesArgs<ExtArgs>
    settings?: boolean | User$settingsArgs<ExtArgs>
    extensions?: boolean | User$extensionsArgs<ExtArgs>
    userExtensions?: boolean | User$userExtensionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      workspaces: Prisma.$WorkspacePayload<ExtArgs>[]
      settings: Prisma.$UserSettingsPayload<ExtArgs> | null
      extensions: Prisma.$ExtensionPayload<ExtArgs>[]
      userExtensions: Prisma.$UserExtensionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string
      passwordHash: string
      role: string
      isActive: boolean
      lastLogin: Date | null
      bio: string | null
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workspaces<T extends User$workspacesArgs<ExtArgs> = {}>(args?: Subset<T, User$workspacesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    settings<T extends User$settingsArgs<ExtArgs> = {}>(args?: Subset<T, User$settingsArgs<ExtArgs>>): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    extensions<T extends User$extensionsArgs<ExtArgs> = {}>(args?: Subset<T, User$extensionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userExtensions<T extends User$userExtensionsArgs<ExtArgs> = {}>(args?: Subset<T, User$userExtensionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly lastLogin: FieldRef<"User", 'DateTime'>
    readonly bio: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.workspaces
   */
  export type User$workspacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    where?: WorkspaceWhereInput
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    cursor?: WorkspaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * User.settings
   */
  export type User$settingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSettings
     */
    omit?: UserSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingsInclude<ExtArgs> | null
    where?: UserSettingsWhereInput
  }

  /**
   * User.extensions
   */
  export type User$extensionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extension
     */
    select?: ExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extension
     */
    omit?: ExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionInclude<ExtArgs> | null
    where?: ExtensionWhereInput
    orderBy?: ExtensionOrderByWithRelationInput | ExtensionOrderByWithRelationInput[]
    cursor?: ExtensionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExtensionScalarFieldEnum | ExtensionScalarFieldEnum[]
  }

  /**
   * User.userExtensions
   */
  export type User$userExtensionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionInclude<ExtArgs> | null
    where?: UserExtensionWhereInput
    orderBy?: UserExtensionOrderByWithRelationInput | UserExtensionOrderByWithRelationInput[]
    cursor?: UserExtensionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserExtensionScalarFieldEnum | UserExtensionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Extension
   */

  export type AggregateExtension = {
    _count: ExtensionCountAggregateOutputType | null
    _min: ExtensionMinAggregateOutputType | null
    _max: ExtensionMaxAggregateOutputType | null
  }

  export type ExtensionMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    authorId: string | null
    gitUrl: string | null
    gitBranch: string | null
    createdAt: Date | null
    updatedAt: Date | null
    active: boolean | null
    installedVersionId: string | null
  }

  export type ExtensionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    authorId: string | null
    gitUrl: string | null
    gitBranch: string | null
    createdAt: Date | null
    updatedAt: Date | null
    active: boolean | null
    installedVersionId: string | null
  }

  export type ExtensionCountAggregateOutputType = {
    id: number
    name: number
    description: number
    authorId: number
    gitUrl: number
    gitBranch: number
    createdAt: number
    updatedAt: number
    active: number
    installedVersionId: number
    _all: number
  }


  export type ExtensionMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    authorId?: true
    gitUrl?: true
    gitBranch?: true
    createdAt?: true
    updatedAt?: true
    active?: true
    installedVersionId?: true
  }

  export type ExtensionMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    authorId?: true
    gitUrl?: true
    gitBranch?: true
    createdAt?: true
    updatedAt?: true
    active?: true
    installedVersionId?: true
  }

  export type ExtensionCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    authorId?: true
    gitUrl?: true
    gitBranch?: true
    createdAt?: true
    updatedAt?: true
    active?: true
    installedVersionId?: true
    _all?: true
  }

  export type ExtensionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Extension to aggregate.
     */
    where?: ExtensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Extensions to fetch.
     */
    orderBy?: ExtensionOrderByWithRelationInput | ExtensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExtensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Extensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Extensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Extensions
    **/
    _count?: true | ExtensionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExtensionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExtensionMaxAggregateInputType
  }

  export type GetExtensionAggregateType<T extends ExtensionAggregateArgs> = {
        [P in keyof T & keyof AggregateExtension]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExtension[P]>
      : GetScalarType<T[P], AggregateExtension[P]>
  }




  export type ExtensionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExtensionWhereInput
    orderBy?: ExtensionOrderByWithAggregationInput | ExtensionOrderByWithAggregationInput[]
    by: ExtensionScalarFieldEnum[] | ExtensionScalarFieldEnum
    having?: ExtensionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExtensionCountAggregateInputType | true
    _min?: ExtensionMinAggregateInputType
    _max?: ExtensionMaxAggregateInputType
  }

  export type ExtensionGroupByOutputType = {
    id: string
    name: string
    description: string | null
    authorId: string
    gitUrl: string | null
    gitBranch: string | null
    createdAt: Date
    updatedAt: Date
    active: boolean
    installedVersionId: string | null
    _count: ExtensionCountAggregateOutputType | null
    _min: ExtensionMinAggregateOutputType | null
    _max: ExtensionMaxAggregateOutputType | null
  }

  type GetExtensionGroupByPayload<T extends ExtensionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExtensionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExtensionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExtensionGroupByOutputType[P]>
            : GetScalarType<T[P], ExtensionGroupByOutputType[P]>
        }
      >
    >


  export type ExtensionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    authorId?: boolean
    gitUrl?: boolean
    gitBranch?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    active?: boolean
    installedVersionId?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
    versions?: boolean | Extension$versionsArgs<ExtArgs>
    installations?: boolean | Extension$installationsArgs<ExtArgs>
    _count?: boolean | ExtensionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["extension"]>

  export type ExtensionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    authorId?: boolean
    gitUrl?: boolean
    gitBranch?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    active?: boolean
    installedVersionId?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["extension"]>

  export type ExtensionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    authorId?: boolean
    gitUrl?: boolean
    gitBranch?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    active?: boolean
    installedVersionId?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["extension"]>

  export type ExtensionSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    authorId?: boolean
    gitUrl?: boolean
    gitBranch?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    active?: boolean
    installedVersionId?: boolean
  }

  export type ExtensionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "authorId" | "gitUrl" | "gitBranch" | "createdAt" | "updatedAt" | "active" | "installedVersionId", ExtArgs["result"]["extension"]>
  export type ExtensionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
    versions?: boolean | Extension$versionsArgs<ExtArgs>
    installations?: boolean | Extension$installationsArgs<ExtArgs>
    _count?: boolean | ExtensionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExtensionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ExtensionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ExtensionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Extension"
    objects: {
      author: Prisma.$UserPayload<ExtArgs>
      versions: Prisma.$ExtensionVersionPayload<ExtArgs>[]
      installations: Prisma.$UserExtensionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      authorId: string
      gitUrl: string | null
      gitBranch: string | null
      createdAt: Date
      updatedAt: Date
      active: boolean
      installedVersionId: string | null
    }, ExtArgs["result"]["extension"]>
    composites: {}
  }

  type ExtensionGetPayload<S extends boolean | null | undefined | ExtensionDefaultArgs> = $Result.GetResult<Prisma.$ExtensionPayload, S>

  type ExtensionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExtensionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExtensionCountAggregateInputType | true
    }

  export interface ExtensionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Extension'], meta: { name: 'Extension' } }
    /**
     * Find zero or one Extension that matches the filter.
     * @param {ExtensionFindUniqueArgs} args - Arguments to find a Extension
     * @example
     * // Get one Extension
     * const extension = await prisma.extension.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExtensionFindUniqueArgs>(args: SelectSubset<T, ExtensionFindUniqueArgs<ExtArgs>>): Prisma__ExtensionClient<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Extension that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExtensionFindUniqueOrThrowArgs} args - Arguments to find a Extension
     * @example
     * // Get one Extension
     * const extension = await prisma.extension.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExtensionFindUniqueOrThrowArgs>(args: SelectSubset<T, ExtensionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExtensionClient<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Extension that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionFindFirstArgs} args - Arguments to find a Extension
     * @example
     * // Get one Extension
     * const extension = await prisma.extension.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExtensionFindFirstArgs>(args?: SelectSubset<T, ExtensionFindFirstArgs<ExtArgs>>): Prisma__ExtensionClient<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Extension that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionFindFirstOrThrowArgs} args - Arguments to find a Extension
     * @example
     * // Get one Extension
     * const extension = await prisma.extension.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExtensionFindFirstOrThrowArgs>(args?: SelectSubset<T, ExtensionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExtensionClient<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Extensions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Extensions
     * const extensions = await prisma.extension.findMany()
     * 
     * // Get first 10 Extensions
     * const extensions = await prisma.extension.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const extensionWithIdOnly = await prisma.extension.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExtensionFindManyArgs>(args?: SelectSubset<T, ExtensionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Extension.
     * @param {ExtensionCreateArgs} args - Arguments to create a Extension.
     * @example
     * // Create one Extension
     * const Extension = await prisma.extension.create({
     *   data: {
     *     // ... data to create a Extension
     *   }
     * })
     * 
     */
    create<T extends ExtensionCreateArgs>(args: SelectSubset<T, ExtensionCreateArgs<ExtArgs>>): Prisma__ExtensionClient<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Extensions.
     * @param {ExtensionCreateManyArgs} args - Arguments to create many Extensions.
     * @example
     * // Create many Extensions
     * const extension = await prisma.extension.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExtensionCreateManyArgs>(args?: SelectSubset<T, ExtensionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Extensions and returns the data saved in the database.
     * @param {ExtensionCreateManyAndReturnArgs} args - Arguments to create many Extensions.
     * @example
     * // Create many Extensions
     * const extension = await prisma.extension.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Extensions and only return the `id`
     * const extensionWithIdOnly = await prisma.extension.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExtensionCreateManyAndReturnArgs>(args?: SelectSubset<T, ExtensionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Extension.
     * @param {ExtensionDeleteArgs} args - Arguments to delete one Extension.
     * @example
     * // Delete one Extension
     * const Extension = await prisma.extension.delete({
     *   where: {
     *     // ... filter to delete one Extension
     *   }
     * })
     * 
     */
    delete<T extends ExtensionDeleteArgs>(args: SelectSubset<T, ExtensionDeleteArgs<ExtArgs>>): Prisma__ExtensionClient<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Extension.
     * @param {ExtensionUpdateArgs} args - Arguments to update one Extension.
     * @example
     * // Update one Extension
     * const extension = await prisma.extension.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExtensionUpdateArgs>(args: SelectSubset<T, ExtensionUpdateArgs<ExtArgs>>): Prisma__ExtensionClient<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Extensions.
     * @param {ExtensionDeleteManyArgs} args - Arguments to filter Extensions to delete.
     * @example
     * // Delete a few Extensions
     * const { count } = await prisma.extension.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExtensionDeleteManyArgs>(args?: SelectSubset<T, ExtensionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Extensions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Extensions
     * const extension = await prisma.extension.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExtensionUpdateManyArgs>(args: SelectSubset<T, ExtensionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Extensions and returns the data updated in the database.
     * @param {ExtensionUpdateManyAndReturnArgs} args - Arguments to update many Extensions.
     * @example
     * // Update many Extensions
     * const extension = await prisma.extension.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Extensions and only return the `id`
     * const extensionWithIdOnly = await prisma.extension.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExtensionUpdateManyAndReturnArgs>(args: SelectSubset<T, ExtensionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Extension.
     * @param {ExtensionUpsertArgs} args - Arguments to update or create a Extension.
     * @example
     * // Update or create a Extension
     * const extension = await prisma.extension.upsert({
     *   create: {
     *     // ... data to create a Extension
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Extension we want to update
     *   }
     * })
     */
    upsert<T extends ExtensionUpsertArgs>(args: SelectSubset<T, ExtensionUpsertArgs<ExtArgs>>): Prisma__ExtensionClient<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Extensions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionCountArgs} args - Arguments to filter Extensions to count.
     * @example
     * // Count the number of Extensions
     * const count = await prisma.extension.count({
     *   where: {
     *     // ... the filter for the Extensions we want to count
     *   }
     * })
    **/
    count<T extends ExtensionCountArgs>(
      args?: Subset<T, ExtensionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExtensionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Extension.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExtensionAggregateArgs>(args: Subset<T, ExtensionAggregateArgs>): Prisma.PrismaPromise<GetExtensionAggregateType<T>>

    /**
     * Group by Extension.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExtensionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExtensionGroupByArgs['orderBy'] }
        : { orderBy?: ExtensionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExtensionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExtensionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Extension model
   */
  readonly fields: ExtensionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Extension.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExtensionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    versions<T extends Extension$versionsArgs<ExtArgs> = {}>(args?: Subset<T, Extension$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtensionVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    installations<T extends Extension$installationsArgs<ExtArgs> = {}>(args?: Subset<T, Extension$installationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Extension model
   */
  interface ExtensionFieldRefs {
    readonly id: FieldRef<"Extension", 'String'>
    readonly name: FieldRef<"Extension", 'String'>
    readonly description: FieldRef<"Extension", 'String'>
    readonly authorId: FieldRef<"Extension", 'String'>
    readonly gitUrl: FieldRef<"Extension", 'String'>
    readonly gitBranch: FieldRef<"Extension", 'String'>
    readonly createdAt: FieldRef<"Extension", 'DateTime'>
    readonly updatedAt: FieldRef<"Extension", 'DateTime'>
    readonly active: FieldRef<"Extension", 'Boolean'>
    readonly installedVersionId: FieldRef<"Extension", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Extension findUnique
   */
  export type ExtensionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extension
     */
    select?: ExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extension
     */
    omit?: ExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionInclude<ExtArgs> | null
    /**
     * Filter, which Extension to fetch.
     */
    where: ExtensionWhereUniqueInput
  }

  /**
   * Extension findUniqueOrThrow
   */
  export type ExtensionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extension
     */
    select?: ExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extension
     */
    omit?: ExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionInclude<ExtArgs> | null
    /**
     * Filter, which Extension to fetch.
     */
    where: ExtensionWhereUniqueInput
  }

  /**
   * Extension findFirst
   */
  export type ExtensionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extension
     */
    select?: ExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extension
     */
    omit?: ExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionInclude<ExtArgs> | null
    /**
     * Filter, which Extension to fetch.
     */
    where?: ExtensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Extensions to fetch.
     */
    orderBy?: ExtensionOrderByWithRelationInput | ExtensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Extensions.
     */
    cursor?: ExtensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Extensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Extensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Extensions.
     */
    distinct?: ExtensionScalarFieldEnum | ExtensionScalarFieldEnum[]
  }

  /**
   * Extension findFirstOrThrow
   */
  export type ExtensionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extension
     */
    select?: ExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extension
     */
    omit?: ExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionInclude<ExtArgs> | null
    /**
     * Filter, which Extension to fetch.
     */
    where?: ExtensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Extensions to fetch.
     */
    orderBy?: ExtensionOrderByWithRelationInput | ExtensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Extensions.
     */
    cursor?: ExtensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Extensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Extensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Extensions.
     */
    distinct?: ExtensionScalarFieldEnum | ExtensionScalarFieldEnum[]
  }

  /**
   * Extension findMany
   */
  export type ExtensionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extension
     */
    select?: ExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extension
     */
    omit?: ExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionInclude<ExtArgs> | null
    /**
     * Filter, which Extensions to fetch.
     */
    where?: ExtensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Extensions to fetch.
     */
    orderBy?: ExtensionOrderByWithRelationInput | ExtensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Extensions.
     */
    cursor?: ExtensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Extensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Extensions.
     */
    skip?: number
    distinct?: ExtensionScalarFieldEnum | ExtensionScalarFieldEnum[]
  }

  /**
   * Extension create
   */
  export type ExtensionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extension
     */
    select?: ExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extension
     */
    omit?: ExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionInclude<ExtArgs> | null
    /**
     * The data needed to create a Extension.
     */
    data: XOR<ExtensionCreateInput, ExtensionUncheckedCreateInput>
  }

  /**
   * Extension createMany
   */
  export type ExtensionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Extensions.
     */
    data: ExtensionCreateManyInput | ExtensionCreateManyInput[]
  }

  /**
   * Extension createManyAndReturn
   */
  export type ExtensionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extension
     */
    select?: ExtensionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Extension
     */
    omit?: ExtensionOmit<ExtArgs> | null
    /**
     * The data used to create many Extensions.
     */
    data: ExtensionCreateManyInput | ExtensionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Extension update
   */
  export type ExtensionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extension
     */
    select?: ExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extension
     */
    omit?: ExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionInclude<ExtArgs> | null
    /**
     * The data needed to update a Extension.
     */
    data: XOR<ExtensionUpdateInput, ExtensionUncheckedUpdateInput>
    /**
     * Choose, which Extension to update.
     */
    where: ExtensionWhereUniqueInput
  }

  /**
   * Extension updateMany
   */
  export type ExtensionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Extensions.
     */
    data: XOR<ExtensionUpdateManyMutationInput, ExtensionUncheckedUpdateManyInput>
    /**
     * Filter which Extensions to update
     */
    where?: ExtensionWhereInput
    /**
     * Limit how many Extensions to update.
     */
    limit?: number
  }

  /**
   * Extension updateManyAndReturn
   */
  export type ExtensionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extension
     */
    select?: ExtensionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Extension
     */
    omit?: ExtensionOmit<ExtArgs> | null
    /**
     * The data used to update Extensions.
     */
    data: XOR<ExtensionUpdateManyMutationInput, ExtensionUncheckedUpdateManyInput>
    /**
     * Filter which Extensions to update
     */
    where?: ExtensionWhereInput
    /**
     * Limit how many Extensions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Extension upsert
   */
  export type ExtensionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extension
     */
    select?: ExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extension
     */
    omit?: ExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionInclude<ExtArgs> | null
    /**
     * The filter to search for the Extension to update in case it exists.
     */
    where: ExtensionWhereUniqueInput
    /**
     * In case the Extension found by the `where` argument doesn't exist, create a new Extension with this data.
     */
    create: XOR<ExtensionCreateInput, ExtensionUncheckedCreateInput>
    /**
     * In case the Extension was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExtensionUpdateInput, ExtensionUncheckedUpdateInput>
  }

  /**
   * Extension delete
   */
  export type ExtensionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extension
     */
    select?: ExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extension
     */
    omit?: ExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionInclude<ExtArgs> | null
    /**
     * Filter which Extension to delete.
     */
    where: ExtensionWhereUniqueInput
  }

  /**
   * Extension deleteMany
   */
  export type ExtensionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Extensions to delete
     */
    where?: ExtensionWhereInput
    /**
     * Limit how many Extensions to delete.
     */
    limit?: number
  }

  /**
   * Extension.versions
   */
  export type Extension$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersion
     */
    select?: ExtensionVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExtensionVersion
     */
    omit?: ExtensionVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionVersionInclude<ExtArgs> | null
    where?: ExtensionVersionWhereInput
    orderBy?: ExtensionVersionOrderByWithRelationInput | ExtensionVersionOrderByWithRelationInput[]
    cursor?: ExtensionVersionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExtensionVersionScalarFieldEnum | ExtensionVersionScalarFieldEnum[]
  }

  /**
   * Extension.installations
   */
  export type Extension$installationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionInclude<ExtArgs> | null
    where?: UserExtensionWhereInput
    orderBy?: UserExtensionOrderByWithRelationInput | UserExtensionOrderByWithRelationInput[]
    cursor?: UserExtensionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserExtensionScalarFieldEnum | UserExtensionScalarFieldEnum[]
  }

  /**
   * Extension without action
   */
  export type ExtensionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Extension
     */
    select?: ExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Extension
     */
    omit?: ExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionInclude<ExtArgs> | null
  }


  /**
   * Model ExtensionVersion
   */

  export type AggregateExtensionVersion = {
    _count: ExtensionVersionCountAggregateOutputType | null
    _min: ExtensionVersionMinAggregateOutputType | null
    _max: ExtensionVersionMaxAggregateOutputType | null
  }

  export type ExtensionVersionMinAggregateOutputType = {
    id: string | null
    extensionId: string | null
    version: string | null
    gitUrl: string | null
    gitBranch: string | null
    status: string | null
    buildLogs: string | null
    entryPointUrl: string | null
    createdAt: Date | null
  }

  export type ExtensionVersionMaxAggregateOutputType = {
    id: string | null
    extensionId: string | null
    version: string | null
    gitUrl: string | null
    gitBranch: string | null
    status: string | null
    buildLogs: string | null
    entryPointUrl: string | null
    createdAt: Date | null
  }

  export type ExtensionVersionCountAggregateOutputType = {
    id: number
    extensionId: number
    version: number
    gitUrl: number
    gitBranch: number
    status: number
    buildLogs: number
    entryPointUrl: number
    createdAt: number
    _all: number
  }


  export type ExtensionVersionMinAggregateInputType = {
    id?: true
    extensionId?: true
    version?: true
    gitUrl?: true
    gitBranch?: true
    status?: true
    buildLogs?: true
    entryPointUrl?: true
    createdAt?: true
  }

  export type ExtensionVersionMaxAggregateInputType = {
    id?: true
    extensionId?: true
    version?: true
    gitUrl?: true
    gitBranch?: true
    status?: true
    buildLogs?: true
    entryPointUrl?: true
    createdAt?: true
  }

  export type ExtensionVersionCountAggregateInputType = {
    id?: true
    extensionId?: true
    version?: true
    gitUrl?: true
    gitBranch?: true
    status?: true
    buildLogs?: true
    entryPointUrl?: true
    createdAt?: true
    _all?: true
  }

  export type ExtensionVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExtensionVersion to aggregate.
     */
    where?: ExtensionVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtensionVersions to fetch.
     */
    orderBy?: ExtensionVersionOrderByWithRelationInput | ExtensionVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExtensionVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtensionVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtensionVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExtensionVersions
    **/
    _count?: true | ExtensionVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExtensionVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExtensionVersionMaxAggregateInputType
  }

  export type GetExtensionVersionAggregateType<T extends ExtensionVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateExtensionVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExtensionVersion[P]>
      : GetScalarType<T[P], AggregateExtensionVersion[P]>
  }




  export type ExtensionVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExtensionVersionWhereInput
    orderBy?: ExtensionVersionOrderByWithAggregationInput | ExtensionVersionOrderByWithAggregationInput[]
    by: ExtensionVersionScalarFieldEnum[] | ExtensionVersionScalarFieldEnum
    having?: ExtensionVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExtensionVersionCountAggregateInputType | true
    _min?: ExtensionVersionMinAggregateInputType
    _max?: ExtensionVersionMaxAggregateInputType
  }

  export type ExtensionVersionGroupByOutputType = {
    id: string
    extensionId: string
    version: string
    gitUrl: string
    gitBranch: string
    status: string
    buildLogs: string
    entryPointUrl: string | null
    createdAt: Date
    _count: ExtensionVersionCountAggregateOutputType | null
    _min: ExtensionVersionMinAggregateOutputType | null
    _max: ExtensionVersionMaxAggregateOutputType | null
  }

  type GetExtensionVersionGroupByPayload<T extends ExtensionVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExtensionVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExtensionVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExtensionVersionGroupByOutputType[P]>
            : GetScalarType<T[P], ExtensionVersionGroupByOutputType[P]>
        }
      >
    >


  export type ExtensionVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    extensionId?: boolean
    version?: boolean
    gitUrl?: boolean
    gitBranch?: boolean
    status?: boolean
    buildLogs?: boolean
    entryPointUrl?: boolean
    createdAt?: boolean
    extension?: boolean | ExtensionDefaultArgs<ExtArgs>
    installations?: boolean | ExtensionVersion$installationsArgs<ExtArgs>
    _count?: boolean | ExtensionVersionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["extensionVersion"]>

  export type ExtensionVersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    extensionId?: boolean
    version?: boolean
    gitUrl?: boolean
    gitBranch?: boolean
    status?: boolean
    buildLogs?: boolean
    entryPointUrl?: boolean
    createdAt?: boolean
    extension?: boolean | ExtensionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["extensionVersion"]>

  export type ExtensionVersionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    extensionId?: boolean
    version?: boolean
    gitUrl?: boolean
    gitBranch?: boolean
    status?: boolean
    buildLogs?: boolean
    entryPointUrl?: boolean
    createdAt?: boolean
    extension?: boolean | ExtensionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["extensionVersion"]>

  export type ExtensionVersionSelectScalar = {
    id?: boolean
    extensionId?: boolean
    version?: boolean
    gitUrl?: boolean
    gitBranch?: boolean
    status?: boolean
    buildLogs?: boolean
    entryPointUrl?: boolean
    createdAt?: boolean
  }

  export type ExtensionVersionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "extensionId" | "version" | "gitUrl" | "gitBranch" | "status" | "buildLogs" | "entryPointUrl" | "createdAt", ExtArgs["result"]["extensionVersion"]>
  export type ExtensionVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    extension?: boolean | ExtensionDefaultArgs<ExtArgs>
    installations?: boolean | ExtensionVersion$installationsArgs<ExtArgs>
    _count?: boolean | ExtensionVersionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExtensionVersionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    extension?: boolean | ExtensionDefaultArgs<ExtArgs>
  }
  export type ExtensionVersionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    extension?: boolean | ExtensionDefaultArgs<ExtArgs>
  }

  export type $ExtensionVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExtensionVersion"
    objects: {
      extension: Prisma.$ExtensionPayload<ExtArgs>
      installations: Prisma.$UserExtensionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      extensionId: string
      version: string
      gitUrl: string
      gitBranch: string
      status: string
      buildLogs: string
      entryPointUrl: string | null
      createdAt: Date
    }, ExtArgs["result"]["extensionVersion"]>
    composites: {}
  }

  type ExtensionVersionGetPayload<S extends boolean | null | undefined | ExtensionVersionDefaultArgs> = $Result.GetResult<Prisma.$ExtensionVersionPayload, S>

  type ExtensionVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExtensionVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExtensionVersionCountAggregateInputType | true
    }

  export interface ExtensionVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExtensionVersion'], meta: { name: 'ExtensionVersion' } }
    /**
     * Find zero or one ExtensionVersion that matches the filter.
     * @param {ExtensionVersionFindUniqueArgs} args - Arguments to find a ExtensionVersion
     * @example
     * // Get one ExtensionVersion
     * const extensionVersion = await prisma.extensionVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExtensionVersionFindUniqueArgs>(args: SelectSubset<T, ExtensionVersionFindUniqueArgs<ExtArgs>>): Prisma__ExtensionVersionClient<$Result.GetResult<Prisma.$ExtensionVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExtensionVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExtensionVersionFindUniqueOrThrowArgs} args - Arguments to find a ExtensionVersion
     * @example
     * // Get one ExtensionVersion
     * const extensionVersion = await prisma.extensionVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExtensionVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, ExtensionVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExtensionVersionClient<$Result.GetResult<Prisma.$ExtensionVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExtensionVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionVersionFindFirstArgs} args - Arguments to find a ExtensionVersion
     * @example
     * // Get one ExtensionVersion
     * const extensionVersion = await prisma.extensionVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExtensionVersionFindFirstArgs>(args?: SelectSubset<T, ExtensionVersionFindFirstArgs<ExtArgs>>): Prisma__ExtensionVersionClient<$Result.GetResult<Prisma.$ExtensionVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExtensionVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionVersionFindFirstOrThrowArgs} args - Arguments to find a ExtensionVersion
     * @example
     * // Get one ExtensionVersion
     * const extensionVersion = await prisma.extensionVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExtensionVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, ExtensionVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExtensionVersionClient<$Result.GetResult<Prisma.$ExtensionVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExtensionVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExtensionVersions
     * const extensionVersions = await prisma.extensionVersion.findMany()
     * 
     * // Get first 10 ExtensionVersions
     * const extensionVersions = await prisma.extensionVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const extensionVersionWithIdOnly = await prisma.extensionVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExtensionVersionFindManyArgs>(args?: SelectSubset<T, ExtensionVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtensionVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExtensionVersion.
     * @param {ExtensionVersionCreateArgs} args - Arguments to create a ExtensionVersion.
     * @example
     * // Create one ExtensionVersion
     * const ExtensionVersion = await prisma.extensionVersion.create({
     *   data: {
     *     // ... data to create a ExtensionVersion
     *   }
     * })
     * 
     */
    create<T extends ExtensionVersionCreateArgs>(args: SelectSubset<T, ExtensionVersionCreateArgs<ExtArgs>>): Prisma__ExtensionVersionClient<$Result.GetResult<Prisma.$ExtensionVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExtensionVersions.
     * @param {ExtensionVersionCreateManyArgs} args - Arguments to create many ExtensionVersions.
     * @example
     * // Create many ExtensionVersions
     * const extensionVersion = await prisma.extensionVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExtensionVersionCreateManyArgs>(args?: SelectSubset<T, ExtensionVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExtensionVersions and returns the data saved in the database.
     * @param {ExtensionVersionCreateManyAndReturnArgs} args - Arguments to create many ExtensionVersions.
     * @example
     * // Create many ExtensionVersions
     * const extensionVersion = await prisma.extensionVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExtensionVersions and only return the `id`
     * const extensionVersionWithIdOnly = await prisma.extensionVersion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExtensionVersionCreateManyAndReturnArgs>(args?: SelectSubset<T, ExtensionVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtensionVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExtensionVersion.
     * @param {ExtensionVersionDeleteArgs} args - Arguments to delete one ExtensionVersion.
     * @example
     * // Delete one ExtensionVersion
     * const ExtensionVersion = await prisma.extensionVersion.delete({
     *   where: {
     *     // ... filter to delete one ExtensionVersion
     *   }
     * })
     * 
     */
    delete<T extends ExtensionVersionDeleteArgs>(args: SelectSubset<T, ExtensionVersionDeleteArgs<ExtArgs>>): Prisma__ExtensionVersionClient<$Result.GetResult<Prisma.$ExtensionVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExtensionVersion.
     * @param {ExtensionVersionUpdateArgs} args - Arguments to update one ExtensionVersion.
     * @example
     * // Update one ExtensionVersion
     * const extensionVersion = await prisma.extensionVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExtensionVersionUpdateArgs>(args: SelectSubset<T, ExtensionVersionUpdateArgs<ExtArgs>>): Prisma__ExtensionVersionClient<$Result.GetResult<Prisma.$ExtensionVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExtensionVersions.
     * @param {ExtensionVersionDeleteManyArgs} args - Arguments to filter ExtensionVersions to delete.
     * @example
     * // Delete a few ExtensionVersions
     * const { count } = await prisma.extensionVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExtensionVersionDeleteManyArgs>(args?: SelectSubset<T, ExtensionVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExtensionVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExtensionVersions
     * const extensionVersion = await prisma.extensionVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExtensionVersionUpdateManyArgs>(args: SelectSubset<T, ExtensionVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExtensionVersions and returns the data updated in the database.
     * @param {ExtensionVersionUpdateManyAndReturnArgs} args - Arguments to update many ExtensionVersions.
     * @example
     * // Update many ExtensionVersions
     * const extensionVersion = await prisma.extensionVersion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExtensionVersions and only return the `id`
     * const extensionVersionWithIdOnly = await prisma.extensionVersion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExtensionVersionUpdateManyAndReturnArgs>(args: SelectSubset<T, ExtensionVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExtensionVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExtensionVersion.
     * @param {ExtensionVersionUpsertArgs} args - Arguments to update or create a ExtensionVersion.
     * @example
     * // Update or create a ExtensionVersion
     * const extensionVersion = await prisma.extensionVersion.upsert({
     *   create: {
     *     // ... data to create a ExtensionVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExtensionVersion we want to update
     *   }
     * })
     */
    upsert<T extends ExtensionVersionUpsertArgs>(args: SelectSubset<T, ExtensionVersionUpsertArgs<ExtArgs>>): Prisma__ExtensionVersionClient<$Result.GetResult<Prisma.$ExtensionVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExtensionVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionVersionCountArgs} args - Arguments to filter ExtensionVersions to count.
     * @example
     * // Count the number of ExtensionVersions
     * const count = await prisma.extensionVersion.count({
     *   where: {
     *     // ... the filter for the ExtensionVersions we want to count
     *   }
     * })
    **/
    count<T extends ExtensionVersionCountArgs>(
      args?: Subset<T, ExtensionVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExtensionVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExtensionVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExtensionVersionAggregateArgs>(args: Subset<T, ExtensionVersionAggregateArgs>): Prisma.PrismaPromise<GetExtensionVersionAggregateType<T>>

    /**
     * Group by ExtensionVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExtensionVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExtensionVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExtensionVersionGroupByArgs['orderBy'] }
        : { orderBy?: ExtensionVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExtensionVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExtensionVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExtensionVersion model
   */
  readonly fields: ExtensionVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExtensionVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExtensionVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    extension<T extends ExtensionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExtensionDefaultArgs<ExtArgs>>): Prisma__ExtensionClient<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    installations<T extends ExtensionVersion$installationsArgs<ExtArgs> = {}>(args?: Subset<T, ExtensionVersion$installationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExtensionVersion model
   */
  interface ExtensionVersionFieldRefs {
    readonly id: FieldRef<"ExtensionVersion", 'String'>
    readonly extensionId: FieldRef<"ExtensionVersion", 'String'>
    readonly version: FieldRef<"ExtensionVersion", 'String'>
    readonly gitUrl: FieldRef<"ExtensionVersion", 'String'>
    readonly gitBranch: FieldRef<"ExtensionVersion", 'String'>
    readonly status: FieldRef<"ExtensionVersion", 'String'>
    readonly buildLogs: FieldRef<"ExtensionVersion", 'String'>
    readonly entryPointUrl: FieldRef<"ExtensionVersion", 'String'>
    readonly createdAt: FieldRef<"ExtensionVersion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExtensionVersion findUnique
   */
  export type ExtensionVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersion
     */
    select?: ExtensionVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExtensionVersion
     */
    omit?: ExtensionVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionVersionInclude<ExtArgs> | null
    /**
     * Filter, which ExtensionVersion to fetch.
     */
    where: ExtensionVersionWhereUniqueInput
  }

  /**
   * ExtensionVersion findUniqueOrThrow
   */
  export type ExtensionVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersion
     */
    select?: ExtensionVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExtensionVersion
     */
    omit?: ExtensionVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionVersionInclude<ExtArgs> | null
    /**
     * Filter, which ExtensionVersion to fetch.
     */
    where: ExtensionVersionWhereUniqueInput
  }

  /**
   * ExtensionVersion findFirst
   */
  export type ExtensionVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersion
     */
    select?: ExtensionVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExtensionVersion
     */
    omit?: ExtensionVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionVersionInclude<ExtArgs> | null
    /**
     * Filter, which ExtensionVersion to fetch.
     */
    where?: ExtensionVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtensionVersions to fetch.
     */
    orderBy?: ExtensionVersionOrderByWithRelationInput | ExtensionVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExtensionVersions.
     */
    cursor?: ExtensionVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtensionVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtensionVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExtensionVersions.
     */
    distinct?: ExtensionVersionScalarFieldEnum | ExtensionVersionScalarFieldEnum[]
  }

  /**
   * ExtensionVersion findFirstOrThrow
   */
  export type ExtensionVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersion
     */
    select?: ExtensionVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExtensionVersion
     */
    omit?: ExtensionVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionVersionInclude<ExtArgs> | null
    /**
     * Filter, which ExtensionVersion to fetch.
     */
    where?: ExtensionVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtensionVersions to fetch.
     */
    orderBy?: ExtensionVersionOrderByWithRelationInput | ExtensionVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExtensionVersions.
     */
    cursor?: ExtensionVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtensionVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtensionVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExtensionVersions.
     */
    distinct?: ExtensionVersionScalarFieldEnum | ExtensionVersionScalarFieldEnum[]
  }

  /**
   * ExtensionVersion findMany
   */
  export type ExtensionVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersion
     */
    select?: ExtensionVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExtensionVersion
     */
    omit?: ExtensionVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionVersionInclude<ExtArgs> | null
    /**
     * Filter, which ExtensionVersions to fetch.
     */
    where?: ExtensionVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExtensionVersions to fetch.
     */
    orderBy?: ExtensionVersionOrderByWithRelationInput | ExtensionVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExtensionVersions.
     */
    cursor?: ExtensionVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExtensionVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExtensionVersions.
     */
    skip?: number
    distinct?: ExtensionVersionScalarFieldEnum | ExtensionVersionScalarFieldEnum[]
  }

  /**
   * ExtensionVersion create
   */
  export type ExtensionVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersion
     */
    select?: ExtensionVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExtensionVersion
     */
    omit?: ExtensionVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a ExtensionVersion.
     */
    data: XOR<ExtensionVersionCreateInput, ExtensionVersionUncheckedCreateInput>
  }

  /**
   * ExtensionVersion createMany
   */
  export type ExtensionVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExtensionVersions.
     */
    data: ExtensionVersionCreateManyInput | ExtensionVersionCreateManyInput[]
  }

  /**
   * ExtensionVersion createManyAndReturn
   */
  export type ExtensionVersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersion
     */
    select?: ExtensionVersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExtensionVersion
     */
    omit?: ExtensionVersionOmit<ExtArgs> | null
    /**
     * The data used to create many ExtensionVersions.
     */
    data: ExtensionVersionCreateManyInput | ExtensionVersionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionVersionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExtensionVersion update
   */
  export type ExtensionVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersion
     */
    select?: ExtensionVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExtensionVersion
     */
    omit?: ExtensionVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a ExtensionVersion.
     */
    data: XOR<ExtensionVersionUpdateInput, ExtensionVersionUncheckedUpdateInput>
    /**
     * Choose, which ExtensionVersion to update.
     */
    where: ExtensionVersionWhereUniqueInput
  }

  /**
   * ExtensionVersion updateMany
   */
  export type ExtensionVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExtensionVersions.
     */
    data: XOR<ExtensionVersionUpdateManyMutationInput, ExtensionVersionUncheckedUpdateManyInput>
    /**
     * Filter which ExtensionVersions to update
     */
    where?: ExtensionVersionWhereInput
    /**
     * Limit how many ExtensionVersions to update.
     */
    limit?: number
  }

  /**
   * ExtensionVersion updateManyAndReturn
   */
  export type ExtensionVersionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersion
     */
    select?: ExtensionVersionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExtensionVersion
     */
    omit?: ExtensionVersionOmit<ExtArgs> | null
    /**
     * The data used to update ExtensionVersions.
     */
    data: XOR<ExtensionVersionUpdateManyMutationInput, ExtensionVersionUncheckedUpdateManyInput>
    /**
     * Filter which ExtensionVersions to update
     */
    where?: ExtensionVersionWhereInput
    /**
     * Limit how many ExtensionVersions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionVersionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExtensionVersion upsert
   */
  export type ExtensionVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersion
     */
    select?: ExtensionVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExtensionVersion
     */
    omit?: ExtensionVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the ExtensionVersion to update in case it exists.
     */
    where: ExtensionVersionWhereUniqueInput
    /**
     * In case the ExtensionVersion found by the `where` argument doesn't exist, create a new ExtensionVersion with this data.
     */
    create: XOR<ExtensionVersionCreateInput, ExtensionVersionUncheckedCreateInput>
    /**
     * In case the ExtensionVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExtensionVersionUpdateInput, ExtensionVersionUncheckedUpdateInput>
  }

  /**
   * ExtensionVersion delete
   */
  export type ExtensionVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersion
     */
    select?: ExtensionVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExtensionVersion
     */
    omit?: ExtensionVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionVersionInclude<ExtArgs> | null
    /**
     * Filter which ExtensionVersion to delete.
     */
    where: ExtensionVersionWhereUniqueInput
  }

  /**
   * ExtensionVersion deleteMany
   */
  export type ExtensionVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExtensionVersions to delete
     */
    where?: ExtensionVersionWhereInput
    /**
     * Limit how many ExtensionVersions to delete.
     */
    limit?: number
  }

  /**
   * ExtensionVersion.installations
   */
  export type ExtensionVersion$installationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionInclude<ExtArgs> | null
    where?: UserExtensionWhereInput
    orderBy?: UserExtensionOrderByWithRelationInput | UserExtensionOrderByWithRelationInput[]
    cursor?: UserExtensionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserExtensionScalarFieldEnum | UserExtensionScalarFieldEnum[]
  }

  /**
   * ExtensionVersion without action
   */
  export type ExtensionVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExtensionVersion
     */
    select?: ExtensionVersionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExtensionVersion
     */
    omit?: ExtensionVersionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExtensionVersionInclude<ExtArgs> | null
  }


  /**
   * Model UserExtension
   */

  export type AggregateUserExtension = {
    _count: UserExtensionCountAggregateOutputType | null
    _min: UserExtensionMinAggregateOutputType | null
    _max: UserExtensionMaxAggregateOutputType | null
  }

  export type UserExtensionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    extensionId: string | null
    installedVersionId: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserExtensionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    extensionId: string | null
    installedVersionId: string | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserExtensionCountAggregateOutputType = {
    id: number
    userId: number
    extensionId: number
    installedVersionId: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserExtensionMinAggregateInputType = {
    id?: true
    userId?: true
    extensionId?: true
    installedVersionId?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserExtensionMaxAggregateInputType = {
    id?: true
    userId?: true
    extensionId?: true
    installedVersionId?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserExtensionCountAggregateInputType = {
    id?: true
    userId?: true
    extensionId?: true
    installedVersionId?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserExtensionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserExtension to aggregate.
     */
    where?: UserExtensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserExtensions to fetch.
     */
    orderBy?: UserExtensionOrderByWithRelationInput | UserExtensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserExtensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserExtensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserExtensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserExtensions
    **/
    _count?: true | UserExtensionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserExtensionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserExtensionMaxAggregateInputType
  }

  export type GetUserExtensionAggregateType<T extends UserExtensionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserExtension]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserExtension[P]>
      : GetScalarType<T[P], AggregateUserExtension[P]>
  }




  export type UserExtensionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserExtensionWhereInput
    orderBy?: UserExtensionOrderByWithAggregationInput | UserExtensionOrderByWithAggregationInput[]
    by: UserExtensionScalarFieldEnum[] | UserExtensionScalarFieldEnum
    having?: UserExtensionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserExtensionCountAggregateInputType | true
    _min?: UserExtensionMinAggregateInputType
    _max?: UserExtensionMaxAggregateInputType
  }

  export type UserExtensionGroupByOutputType = {
    id: string
    userId: string
    extensionId: string
    installedVersionId: string
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserExtensionCountAggregateOutputType | null
    _min: UserExtensionMinAggregateOutputType | null
    _max: UserExtensionMaxAggregateOutputType | null
  }

  type GetUserExtensionGroupByPayload<T extends UserExtensionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserExtensionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserExtensionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserExtensionGroupByOutputType[P]>
            : GetScalarType<T[P], UserExtensionGroupByOutputType[P]>
        }
      >
    >


  export type UserExtensionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    extensionId?: boolean
    installedVersionId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    extension?: boolean | ExtensionDefaultArgs<ExtArgs>
    installedVersion?: boolean | ExtensionVersionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userExtension"]>

  export type UserExtensionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    extensionId?: boolean
    installedVersionId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    extension?: boolean | ExtensionDefaultArgs<ExtArgs>
    installedVersion?: boolean | ExtensionVersionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userExtension"]>

  export type UserExtensionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    extensionId?: boolean
    installedVersionId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    extension?: boolean | ExtensionDefaultArgs<ExtArgs>
    installedVersion?: boolean | ExtensionVersionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userExtension"]>

  export type UserExtensionSelectScalar = {
    id?: boolean
    userId?: boolean
    extensionId?: boolean
    installedVersionId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserExtensionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "extensionId" | "installedVersionId" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["userExtension"]>
  export type UserExtensionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    extension?: boolean | ExtensionDefaultArgs<ExtArgs>
    installedVersion?: boolean | ExtensionVersionDefaultArgs<ExtArgs>
  }
  export type UserExtensionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    extension?: boolean | ExtensionDefaultArgs<ExtArgs>
    installedVersion?: boolean | ExtensionVersionDefaultArgs<ExtArgs>
  }
  export type UserExtensionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    extension?: boolean | ExtensionDefaultArgs<ExtArgs>
    installedVersion?: boolean | ExtensionVersionDefaultArgs<ExtArgs>
  }

  export type $UserExtensionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserExtension"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      extension: Prisma.$ExtensionPayload<ExtArgs>
      installedVersion: Prisma.$ExtensionVersionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      extensionId: string
      installedVersionId: string
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userExtension"]>
    composites: {}
  }

  type UserExtensionGetPayload<S extends boolean | null | undefined | UserExtensionDefaultArgs> = $Result.GetResult<Prisma.$UserExtensionPayload, S>

  type UserExtensionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserExtensionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserExtensionCountAggregateInputType | true
    }

  export interface UserExtensionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserExtension'], meta: { name: 'UserExtension' } }
    /**
     * Find zero or one UserExtension that matches the filter.
     * @param {UserExtensionFindUniqueArgs} args - Arguments to find a UserExtension
     * @example
     * // Get one UserExtension
     * const userExtension = await prisma.userExtension.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserExtensionFindUniqueArgs>(args: SelectSubset<T, UserExtensionFindUniqueArgs<ExtArgs>>): Prisma__UserExtensionClient<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserExtension that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserExtensionFindUniqueOrThrowArgs} args - Arguments to find a UserExtension
     * @example
     * // Get one UserExtension
     * const userExtension = await prisma.userExtension.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserExtensionFindUniqueOrThrowArgs>(args: SelectSubset<T, UserExtensionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserExtensionClient<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserExtension that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserExtensionFindFirstArgs} args - Arguments to find a UserExtension
     * @example
     * // Get one UserExtension
     * const userExtension = await prisma.userExtension.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserExtensionFindFirstArgs>(args?: SelectSubset<T, UserExtensionFindFirstArgs<ExtArgs>>): Prisma__UserExtensionClient<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserExtension that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserExtensionFindFirstOrThrowArgs} args - Arguments to find a UserExtension
     * @example
     * // Get one UserExtension
     * const userExtension = await prisma.userExtension.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserExtensionFindFirstOrThrowArgs>(args?: SelectSubset<T, UserExtensionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserExtensionClient<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserExtensions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserExtensionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserExtensions
     * const userExtensions = await prisma.userExtension.findMany()
     * 
     * // Get first 10 UserExtensions
     * const userExtensions = await prisma.userExtension.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userExtensionWithIdOnly = await prisma.userExtension.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserExtensionFindManyArgs>(args?: SelectSubset<T, UserExtensionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserExtension.
     * @param {UserExtensionCreateArgs} args - Arguments to create a UserExtension.
     * @example
     * // Create one UserExtension
     * const UserExtension = await prisma.userExtension.create({
     *   data: {
     *     // ... data to create a UserExtension
     *   }
     * })
     * 
     */
    create<T extends UserExtensionCreateArgs>(args: SelectSubset<T, UserExtensionCreateArgs<ExtArgs>>): Prisma__UserExtensionClient<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserExtensions.
     * @param {UserExtensionCreateManyArgs} args - Arguments to create many UserExtensions.
     * @example
     * // Create many UserExtensions
     * const userExtension = await prisma.userExtension.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserExtensionCreateManyArgs>(args?: SelectSubset<T, UserExtensionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserExtensions and returns the data saved in the database.
     * @param {UserExtensionCreateManyAndReturnArgs} args - Arguments to create many UserExtensions.
     * @example
     * // Create many UserExtensions
     * const userExtension = await prisma.userExtension.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserExtensions and only return the `id`
     * const userExtensionWithIdOnly = await prisma.userExtension.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserExtensionCreateManyAndReturnArgs>(args?: SelectSubset<T, UserExtensionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserExtension.
     * @param {UserExtensionDeleteArgs} args - Arguments to delete one UserExtension.
     * @example
     * // Delete one UserExtension
     * const UserExtension = await prisma.userExtension.delete({
     *   where: {
     *     // ... filter to delete one UserExtension
     *   }
     * })
     * 
     */
    delete<T extends UserExtensionDeleteArgs>(args: SelectSubset<T, UserExtensionDeleteArgs<ExtArgs>>): Prisma__UserExtensionClient<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserExtension.
     * @param {UserExtensionUpdateArgs} args - Arguments to update one UserExtension.
     * @example
     * // Update one UserExtension
     * const userExtension = await prisma.userExtension.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserExtensionUpdateArgs>(args: SelectSubset<T, UserExtensionUpdateArgs<ExtArgs>>): Prisma__UserExtensionClient<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserExtensions.
     * @param {UserExtensionDeleteManyArgs} args - Arguments to filter UserExtensions to delete.
     * @example
     * // Delete a few UserExtensions
     * const { count } = await prisma.userExtension.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserExtensionDeleteManyArgs>(args?: SelectSubset<T, UserExtensionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserExtensions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserExtensionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserExtensions
     * const userExtension = await prisma.userExtension.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserExtensionUpdateManyArgs>(args: SelectSubset<T, UserExtensionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserExtensions and returns the data updated in the database.
     * @param {UserExtensionUpdateManyAndReturnArgs} args - Arguments to update many UserExtensions.
     * @example
     * // Update many UserExtensions
     * const userExtension = await prisma.userExtension.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserExtensions and only return the `id`
     * const userExtensionWithIdOnly = await prisma.userExtension.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserExtensionUpdateManyAndReturnArgs>(args: SelectSubset<T, UserExtensionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserExtension.
     * @param {UserExtensionUpsertArgs} args - Arguments to update or create a UserExtension.
     * @example
     * // Update or create a UserExtension
     * const userExtension = await prisma.userExtension.upsert({
     *   create: {
     *     // ... data to create a UserExtension
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserExtension we want to update
     *   }
     * })
     */
    upsert<T extends UserExtensionUpsertArgs>(args: SelectSubset<T, UserExtensionUpsertArgs<ExtArgs>>): Prisma__UserExtensionClient<$Result.GetResult<Prisma.$UserExtensionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserExtensions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserExtensionCountArgs} args - Arguments to filter UserExtensions to count.
     * @example
     * // Count the number of UserExtensions
     * const count = await prisma.userExtension.count({
     *   where: {
     *     // ... the filter for the UserExtensions we want to count
     *   }
     * })
    **/
    count<T extends UserExtensionCountArgs>(
      args?: Subset<T, UserExtensionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserExtensionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserExtension.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserExtensionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserExtensionAggregateArgs>(args: Subset<T, UserExtensionAggregateArgs>): Prisma.PrismaPromise<GetUserExtensionAggregateType<T>>

    /**
     * Group by UserExtension.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserExtensionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserExtensionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserExtensionGroupByArgs['orderBy'] }
        : { orderBy?: UserExtensionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserExtensionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserExtensionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserExtension model
   */
  readonly fields: UserExtensionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserExtension.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserExtensionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    extension<T extends ExtensionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExtensionDefaultArgs<ExtArgs>>): Prisma__ExtensionClient<$Result.GetResult<Prisma.$ExtensionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    installedVersion<T extends ExtensionVersionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExtensionVersionDefaultArgs<ExtArgs>>): Prisma__ExtensionVersionClient<$Result.GetResult<Prisma.$ExtensionVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserExtension model
   */
  interface UserExtensionFieldRefs {
    readonly id: FieldRef<"UserExtension", 'String'>
    readonly userId: FieldRef<"UserExtension", 'String'>
    readonly extensionId: FieldRef<"UserExtension", 'String'>
    readonly installedVersionId: FieldRef<"UserExtension", 'String'>
    readonly active: FieldRef<"UserExtension", 'Boolean'>
    readonly createdAt: FieldRef<"UserExtension", 'DateTime'>
    readonly updatedAt: FieldRef<"UserExtension", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserExtension findUnique
   */
  export type UserExtensionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionInclude<ExtArgs> | null
    /**
     * Filter, which UserExtension to fetch.
     */
    where: UserExtensionWhereUniqueInput
  }

  /**
   * UserExtension findUniqueOrThrow
   */
  export type UserExtensionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionInclude<ExtArgs> | null
    /**
     * Filter, which UserExtension to fetch.
     */
    where: UserExtensionWhereUniqueInput
  }

  /**
   * UserExtension findFirst
   */
  export type UserExtensionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionInclude<ExtArgs> | null
    /**
     * Filter, which UserExtension to fetch.
     */
    where?: UserExtensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserExtensions to fetch.
     */
    orderBy?: UserExtensionOrderByWithRelationInput | UserExtensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserExtensions.
     */
    cursor?: UserExtensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserExtensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserExtensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserExtensions.
     */
    distinct?: UserExtensionScalarFieldEnum | UserExtensionScalarFieldEnum[]
  }

  /**
   * UserExtension findFirstOrThrow
   */
  export type UserExtensionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionInclude<ExtArgs> | null
    /**
     * Filter, which UserExtension to fetch.
     */
    where?: UserExtensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserExtensions to fetch.
     */
    orderBy?: UserExtensionOrderByWithRelationInput | UserExtensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserExtensions.
     */
    cursor?: UserExtensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserExtensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserExtensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserExtensions.
     */
    distinct?: UserExtensionScalarFieldEnum | UserExtensionScalarFieldEnum[]
  }

  /**
   * UserExtension findMany
   */
  export type UserExtensionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionInclude<ExtArgs> | null
    /**
     * Filter, which UserExtensions to fetch.
     */
    where?: UserExtensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserExtensions to fetch.
     */
    orderBy?: UserExtensionOrderByWithRelationInput | UserExtensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserExtensions.
     */
    cursor?: UserExtensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserExtensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserExtensions.
     */
    skip?: number
    distinct?: UserExtensionScalarFieldEnum | UserExtensionScalarFieldEnum[]
  }

  /**
   * UserExtension create
   */
  export type UserExtensionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionInclude<ExtArgs> | null
    /**
     * The data needed to create a UserExtension.
     */
    data: XOR<UserExtensionCreateInput, UserExtensionUncheckedCreateInput>
  }

  /**
   * UserExtension createMany
   */
  export type UserExtensionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserExtensions.
     */
    data: UserExtensionCreateManyInput | UserExtensionCreateManyInput[]
  }

  /**
   * UserExtension createManyAndReturn
   */
  export type UserExtensionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * The data used to create many UserExtensions.
     */
    data: UserExtensionCreateManyInput | UserExtensionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserExtension update
   */
  export type UserExtensionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionInclude<ExtArgs> | null
    /**
     * The data needed to update a UserExtension.
     */
    data: XOR<UserExtensionUpdateInput, UserExtensionUncheckedUpdateInput>
    /**
     * Choose, which UserExtension to update.
     */
    where: UserExtensionWhereUniqueInput
  }

  /**
   * UserExtension updateMany
   */
  export type UserExtensionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserExtensions.
     */
    data: XOR<UserExtensionUpdateManyMutationInput, UserExtensionUncheckedUpdateManyInput>
    /**
     * Filter which UserExtensions to update
     */
    where?: UserExtensionWhereInput
    /**
     * Limit how many UserExtensions to update.
     */
    limit?: number
  }

  /**
   * UserExtension updateManyAndReturn
   */
  export type UserExtensionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * The data used to update UserExtensions.
     */
    data: XOR<UserExtensionUpdateManyMutationInput, UserExtensionUncheckedUpdateManyInput>
    /**
     * Filter which UserExtensions to update
     */
    where?: UserExtensionWhereInput
    /**
     * Limit how many UserExtensions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserExtension upsert
   */
  export type UserExtensionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionInclude<ExtArgs> | null
    /**
     * The filter to search for the UserExtension to update in case it exists.
     */
    where: UserExtensionWhereUniqueInput
    /**
     * In case the UserExtension found by the `where` argument doesn't exist, create a new UserExtension with this data.
     */
    create: XOR<UserExtensionCreateInput, UserExtensionUncheckedCreateInput>
    /**
     * In case the UserExtension was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserExtensionUpdateInput, UserExtensionUncheckedUpdateInput>
  }

  /**
   * UserExtension delete
   */
  export type UserExtensionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionInclude<ExtArgs> | null
    /**
     * Filter which UserExtension to delete.
     */
    where: UserExtensionWhereUniqueInput
  }

  /**
   * UserExtension deleteMany
   */
  export type UserExtensionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserExtensions to delete
     */
    where?: UserExtensionWhereInput
    /**
     * Limit how many UserExtensions to delete.
     */
    limit?: number
  }

  /**
   * UserExtension without action
   */
  export type UserExtensionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserExtension
     */
    select?: UserExtensionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserExtension
     */
    omit?: UserExtensionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserExtensionInclude<ExtArgs> | null
  }


  /**
   * Model Workspace
   */

  export type AggregateWorkspace = {
    _count: WorkspaceCountAggregateOutputType | null
    _min: WorkspaceMinAggregateOutputType | null
    _max: WorkspaceMaxAggregateOutputType | null
  }

  export type WorkspaceMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    ownerId: string | null
    isPublic: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    ownerId: string | null
    isPublic: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceCountAggregateOutputType = {
    id: number
    name: number
    description: number
    ownerId: number
    isPublic: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WorkspaceMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    ownerId?: true
    isPublic?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    ownerId?: true
    isPublic?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    ownerId?: true
    isPublic?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WorkspaceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workspace to aggregate.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Workspaces
    **/
    _count?: true | WorkspaceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkspaceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkspaceMaxAggregateInputType
  }

  export type GetWorkspaceAggregateType<T extends WorkspaceAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkspace]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkspace[P]>
      : GetScalarType<T[P], AggregateWorkspace[P]>
  }




  export type WorkspaceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceWhereInput
    orderBy?: WorkspaceOrderByWithAggregationInput | WorkspaceOrderByWithAggregationInput[]
    by: WorkspaceScalarFieldEnum[] | WorkspaceScalarFieldEnum
    having?: WorkspaceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkspaceCountAggregateInputType | true
    _min?: WorkspaceMinAggregateInputType
    _max?: WorkspaceMaxAggregateInputType
  }

  export type WorkspaceGroupByOutputType = {
    id: string
    name: string
    description: string | null
    ownerId: string
    isPublic: boolean
    createdAt: Date
    updatedAt: Date
    _count: WorkspaceCountAggregateOutputType | null
    _min: WorkspaceMinAggregateOutputType | null
    _max: WorkspaceMaxAggregateOutputType | null
  }

  type GetWorkspaceGroupByPayload<T extends WorkspaceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkspaceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkspaceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkspaceGroupByOutputType[P]>
            : GetScalarType<T[P], WorkspaceGroupByOutputType[P]>
        }
      >
    >


  export type WorkspaceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    ownerId?: boolean
    isPublic?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    settings?: boolean | Workspace$settingsArgs<ExtArgs>
    editorState?: boolean | Workspace$editorStateArgs<ExtArgs>
    secrets?: boolean | Workspace$secretsArgs<ExtArgs>
    _count?: boolean | WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    ownerId?: boolean
    isPublic?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    ownerId?: boolean
    isPublic?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    ownerId?: boolean
    isPublic?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WorkspaceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "ownerId" | "isPublic" | "createdAt" | "updatedAt", ExtArgs["result"]["workspace"]>
  export type WorkspaceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    settings?: boolean | Workspace$settingsArgs<ExtArgs>
    editorState?: boolean | Workspace$editorStateArgs<ExtArgs>
    secrets?: boolean | Workspace$secretsArgs<ExtArgs>
    _count?: boolean | WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkspaceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WorkspaceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WorkspacePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Workspace"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      settings: Prisma.$WorkspaceSettingsPayload<ExtArgs> | null
      editorState: Prisma.$EditorStatePayload<ExtArgs> | null
      secrets: Prisma.$WorkspaceSecretPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      ownerId: string
      isPublic: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["workspace"]>
    composites: {}
  }

  type WorkspaceGetPayload<S extends boolean | null | undefined | WorkspaceDefaultArgs> = $Result.GetResult<Prisma.$WorkspacePayload, S>

  type WorkspaceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkspaceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkspaceCountAggregateInputType | true
    }

  export interface WorkspaceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Workspace'], meta: { name: 'Workspace' } }
    /**
     * Find zero or one Workspace that matches the filter.
     * @param {WorkspaceFindUniqueArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkspaceFindUniqueArgs>(args: SelectSubset<T, WorkspaceFindUniqueArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Workspace that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkspaceFindUniqueOrThrowArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkspaceFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkspaceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workspace that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindFirstArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkspaceFindFirstArgs>(args?: SelectSubset<T, WorkspaceFindFirstArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Workspace that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindFirstOrThrowArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkspaceFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkspaceFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Workspaces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Workspaces
     * const workspaces = await prisma.workspace.findMany()
     * 
     * // Get first 10 Workspaces
     * const workspaces = await prisma.workspace.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workspaceWithIdOnly = await prisma.workspace.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkspaceFindManyArgs>(args?: SelectSubset<T, WorkspaceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Workspace.
     * @param {WorkspaceCreateArgs} args - Arguments to create a Workspace.
     * @example
     * // Create one Workspace
     * const Workspace = await prisma.workspace.create({
     *   data: {
     *     // ... data to create a Workspace
     *   }
     * })
     * 
     */
    create<T extends WorkspaceCreateArgs>(args: SelectSubset<T, WorkspaceCreateArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Workspaces.
     * @param {WorkspaceCreateManyArgs} args - Arguments to create many Workspaces.
     * @example
     * // Create many Workspaces
     * const workspace = await prisma.workspace.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkspaceCreateManyArgs>(args?: SelectSubset<T, WorkspaceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Workspaces and returns the data saved in the database.
     * @param {WorkspaceCreateManyAndReturnArgs} args - Arguments to create many Workspaces.
     * @example
     * // Create many Workspaces
     * const workspace = await prisma.workspace.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Workspaces and only return the `id`
     * const workspaceWithIdOnly = await prisma.workspace.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkspaceCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkspaceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Workspace.
     * @param {WorkspaceDeleteArgs} args - Arguments to delete one Workspace.
     * @example
     * // Delete one Workspace
     * const Workspace = await prisma.workspace.delete({
     *   where: {
     *     // ... filter to delete one Workspace
     *   }
     * })
     * 
     */
    delete<T extends WorkspaceDeleteArgs>(args: SelectSubset<T, WorkspaceDeleteArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Workspace.
     * @param {WorkspaceUpdateArgs} args - Arguments to update one Workspace.
     * @example
     * // Update one Workspace
     * const workspace = await prisma.workspace.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkspaceUpdateArgs>(args: SelectSubset<T, WorkspaceUpdateArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Workspaces.
     * @param {WorkspaceDeleteManyArgs} args - Arguments to filter Workspaces to delete.
     * @example
     * // Delete a few Workspaces
     * const { count } = await prisma.workspace.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkspaceDeleteManyArgs>(args?: SelectSubset<T, WorkspaceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Workspaces
     * const workspace = await prisma.workspace.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkspaceUpdateManyArgs>(args: SelectSubset<T, WorkspaceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workspaces and returns the data updated in the database.
     * @param {WorkspaceUpdateManyAndReturnArgs} args - Arguments to update many Workspaces.
     * @example
     * // Update many Workspaces
     * const workspace = await prisma.workspace.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Workspaces and only return the `id`
     * const workspaceWithIdOnly = await prisma.workspace.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkspaceUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkspaceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Workspace.
     * @param {WorkspaceUpsertArgs} args - Arguments to update or create a Workspace.
     * @example
     * // Update or create a Workspace
     * const workspace = await prisma.workspace.upsert({
     *   create: {
     *     // ... data to create a Workspace
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Workspace we want to update
     *   }
     * })
     */
    upsert<T extends WorkspaceUpsertArgs>(args: SelectSubset<T, WorkspaceUpsertArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Workspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceCountArgs} args - Arguments to filter Workspaces to count.
     * @example
     * // Count the number of Workspaces
     * const count = await prisma.workspace.count({
     *   where: {
     *     // ... the filter for the Workspaces we want to count
     *   }
     * })
    **/
    count<T extends WorkspaceCountArgs>(
      args?: Subset<T, WorkspaceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkspaceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Workspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkspaceAggregateArgs>(args: Subset<T, WorkspaceAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceAggregateType<T>>

    /**
     * Group by Workspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkspaceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkspaceGroupByArgs['orderBy'] }
        : { orderBy?: WorkspaceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkspaceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Workspace model
   */
  readonly fields: WorkspaceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Workspace.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkspaceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    settings<T extends Workspace$settingsArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$settingsArgs<ExtArgs>>): Prisma__WorkspaceSettingsClient<$Result.GetResult<Prisma.$WorkspaceSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    editorState<T extends Workspace$editorStateArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$editorStateArgs<ExtArgs>>): Prisma__EditorStateClient<$Result.GetResult<Prisma.$EditorStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    secrets<T extends Workspace$secretsArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$secretsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceSecretPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Workspace model
   */
  interface WorkspaceFieldRefs {
    readonly id: FieldRef<"Workspace", 'String'>
    readonly name: FieldRef<"Workspace", 'String'>
    readonly description: FieldRef<"Workspace", 'String'>
    readonly ownerId: FieldRef<"Workspace", 'String'>
    readonly isPublic: FieldRef<"Workspace", 'Boolean'>
    readonly createdAt: FieldRef<"Workspace", 'DateTime'>
    readonly updatedAt: FieldRef<"Workspace", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Workspace findUnique
   */
  export type WorkspaceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace findUniqueOrThrow
   */
  export type WorkspaceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace findFirst
   */
  export type WorkspaceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace findFirstOrThrow
   */
  export type WorkspaceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace findMany
   */
  export type WorkspaceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspaces to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace create
   */
  export type WorkspaceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to create a Workspace.
     */
    data: XOR<WorkspaceCreateInput, WorkspaceUncheckedCreateInput>
  }

  /**
   * Workspace createMany
   */
  export type WorkspaceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Workspaces.
     */
    data: WorkspaceCreateManyInput | WorkspaceCreateManyInput[]
  }

  /**
   * Workspace createManyAndReturn
   */
  export type WorkspaceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * The data used to create many Workspaces.
     */
    data: WorkspaceCreateManyInput | WorkspaceCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Workspace update
   */
  export type WorkspaceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to update a Workspace.
     */
    data: XOR<WorkspaceUpdateInput, WorkspaceUncheckedUpdateInput>
    /**
     * Choose, which Workspace to update.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace updateMany
   */
  export type WorkspaceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Workspaces.
     */
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyInput>
    /**
     * Filter which Workspaces to update
     */
    where?: WorkspaceWhereInput
    /**
     * Limit how many Workspaces to update.
     */
    limit?: number
  }

  /**
   * Workspace updateManyAndReturn
   */
  export type WorkspaceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * The data used to update Workspaces.
     */
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyInput>
    /**
     * Filter which Workspaces to update
     */
    where?: WorkspaceWhereInput
    /**
     * Limit how many Workspaces to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Workspace upsert
   */
  export type WorkspaceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The filter to search for the Workspace to update in case it exists.
     */
    where: WorkspaceWhereUniqueInput
    /**
     * In case the Workspace found by the `where` argument doesn't exist, create a new Workspace with this data.
     */
    create: XOR<WorkspaceCreateInput, WorkspaceUncheckedCreateInput>
    /**
     * In case the Workspace was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkspaceUpdateInput, WorkspaceUncheckedUpdateInput>
  }

  /**
   * Workspace delete
   */
  export type WorkspaceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter which Workspace to delete.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace deleteMany
   */
  export type WorkspaceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workspaces to delete
     */
    where?: WorkspaceWhereInput
    /**
     * Limit how many Workspaces to delete.
     */
    limit?: number
  }

  /**
   * Workspace.settings
   */
  export type Workspace$settingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSettings
     */
    select?: WorkspaceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSettings
     */
    omit?: WorkspaceSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSettingsInclude<ExtArgs> | null
    where?: WorkspaceSettingsWhereInput
  }

  /**
   * Workspace.editorState
   */
  export type Workspace$editorStateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorState
     */
    select?: EditorStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EditorState
     */
    omit?: EditorStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EditorStateInclude<ExtArgs> | null
    where?: EditorStateWhereInput
  }

  /**
   * Workspace.secrets
   */
  export type Workspace$secretsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSecret
     */
    select?: WorkspaceSecretSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSecret
     */
    omit?: WorkspaceSecretOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSecretInclude<ExtArgs> | null
    where?: WorkspaceSecretWhereInput
    orderBy?: WorkspaceSecretOrderByWithRelationInput | WorkspaceSecretOrderByWithRelationInput[]
    cursor?: WorkspaceSecretWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkspaceSecretScalarFieldEnum | WorkspaceSecretScalarFieldEnum[]
  }

  /**
   * Workspace without action
   */
  export type WorkspaceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Workspace
     */
    omit?: WorkspaceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
  }


  /**
   * Model WorkspaceSecret
   */

  export type AggregateWorkspaceSecret = {
    _count: WorkspaceSecretCountAggregateOutputType | null
    _min: WorkspaceSecretMinAggregateOutputType | null
    _max: WorkspaceSecretMaxAggregateOutputType | null
  }

  export type WorkspaceSecretMinAggregateOutputType = {
    id: string | null
    workspaceId: string | null
    key: string | null
    value: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceSecretMaxAggregateOutputType = {
    id: string | null
    workspaceId: string | null
    key: string | null
    value: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkspaceSecretCountAggregateOutputType = {
    id: number
    workspaceId: number
    key: number
    value: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WorkspaceSecretMinAggregateInputType = {
    id?: true
    workspaceId?: true
    key?: true
    value?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceSecretMaxAggregateInputType = {
    id?: true
    workspaceId?: true
    key?: true
    value?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkspaceSecretCountAggregateInputType = {
    id?: true
    workspaceId?: true
    key?: true
    value?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WorkspaceSecretAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkspaceSecret to aggregate.
     */
    where?: WorkspaceSecretWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceSecrets to fetch.
     */
    orderBy?: WorkspaceSecretOrderByWithRelationInput | WorkspaceSecretOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkspaceSecretWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceSecrets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceSecrets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkspaceSecrets
    **/
    _count?: true | WorkspaceSecretCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkspaceSecretMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkspaceSecretMaxAggregateInputType
  }

  export type GetWorkspaceSecretAggregateType<T extends WorkspaceSecretAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkspaceSecret]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkspaceSecret[P]>
      : GetScalarType<T[P], AggregateWorkspaceSecret[P]>
  }




  export type WorkspaceSecretGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceSecretWhereInput
    orderBy?: WorkspaceSecretOrderByWithAggregationInput | WorkspaceSecretOrderByWithAggregationInput[]
    by: WorkspaceSecretScalarFieldEnum[] | WorkspaceSecretScalarFieldEnum
    having?: WorkspaceSecretScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkspaceSecretCountAggregateInputType | true
    _min?: WorkspaceSecretMinAggregateInputType
    _max?: WorkspaceSecretMaxAggregateInputType
  }

  export type WorkspaceSecretGroupByOutputType = {
    id: string
    workspaceId: string
    key: string
    value: string
    createdAt: Date
    updatedAt: Date
    _count: WorkspaceSecretCountAggregateOutputType | null
    _min: WorkspaceSecretMinAggregateOutputType | null
    _max: WorkspaceSecretMaxAggregateOutputType | null
  }

  type GetWorkspaceSecretGroupByPayload<T extends WorkspaceSecretGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkspaceSecretGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkspaceSecretGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkspaceSecretGroupByOutputType[P]>
            : GetScalarType<T[P], WorkspaceSecretGroupByOutputType[P]>
        }
      >
    >


  export type WorkspaceSecretSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workspaceId?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceSecret"]>

  export type WorkspaceSecretSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workspaceId?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceSecret"]>

  export type WorkspaceSecretSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workspaceId?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceSecret"]>

  export type WorkspaceSecretSelectScalar = {
    id?: boolean
    workspaceId?: boolean
    key?: boolean
    value?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WorkspaceSecretOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "workspaceId" | "key" | "value" | "createdAt" | "updatedAt", ExtArgs["result"]["workspaceSecret"]>
  export type WorkspaceSecretInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type WorkspaceSecretIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type WorkspaceSecretIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }

  export type $WorkspaceSecretPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkspaceSecret"
    objects: {
      workspace: Prisma.$WorkspacePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      workspaceId: string
      key: string
      value: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["workspaceSecret"]>
    composites: {}
  }

  type WorkspaceSecretGetPayload<S extends boolean | null | undefined | WorkspaceSecretDefaultArgs> = $Result.GetResult<Prisma.$WorkspaceSecretPayload, S>

  type WorkspaceSecretCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkspaceSecretFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkspaceSecretCountAggregateInputType | true
    }

  export interface WorkspaceSecretDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkspaceSecret'], meta: { name: 'WorkspaceSecret' } }
    /**
     * Find zero or one WorkspaceSecret that matches the filter.
     * @param {WorkspaceSecretFindUniqueArgs} args - Arguments to find a WorkspaceSecret
     * @example
     * // Get one WorkspaceSecret
     * const workspaceSecret = await prisma.workspaceSecret.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkspaceSecretFindUniqueArgs>(args: SelectSubset<T, WorkspaceSecretFindUniqueArgs<ExtArgs>>): Prisma__WorkspaceSecretClient<$Result.GetResult<Prisma.$WorkspaceSecretPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WorkspaceSecret that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkspaceSecretFindUniqueOrThrowArgs} args - Arguments to find a WorkspaceSecret
     * @example
     * // Get one WorkspaceSecret
     * const workspaceSecret = await prisma.workspaceSecret.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkspaceSecretFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkspaceSecretFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkspaceSecretClient<$Result.GetResult<Prisma.$WorkspaceSecretPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkspaceSecret that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSecretFindFirstArgs} args - Arguments to find a WorkspaceSecret
     * @example
     * // Get one WorkspaceSecret
     * const workspaceSecret = await prisma.workspaceSecret.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkspaceSecretFindFirstArgs>(args?: SelectSubset<T, WorkspaceSecretFindFirstArgs<ExtArgs>>): Prisma__WorkspaceSecretClient<$Result.GetResult<Prisma.$WorkspaceSecretPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkspaceSecret that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSecretFindFirstOrThrowArgs} args - Arguments to find a WorkspaceSecret
     * @example
     * // Get one WorkspaceSecret
     * const workspaceSecret = await prisma.workspaceSecret.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkspaceSecretFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkspaceSecretFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkspaceSecretClient<$Result.GetResult<Prisma.$WorkspaceSecretPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WorkspaceSecrets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSecretFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkspaceSecrets
     * const workspaceSecrets = await prisma.workspaceSecret.findMany()
     * 
     * // Get first 10 WorkspaceSecrets
     * const workspaceSecrets = await prisma.workspaceSecret.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workspaceSecretWithIdOnly = await prisma.workspaceSecret.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkspaceSecretFindManyArgs>(args?: SelectSubset<T, WorkspaceSecretFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceSecretPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WorkspaceSecret.
     * @param {WorkspaceSecretCreateArgs} args - Arguments to create a WorkspaceSecret.
     * @example
     * // Create one WorkspaceSecret
     * const WorkspaceSecret = await prisma.workspaceSecret.create({
     *   data: {
     *     // ... data to create a WorkspaceSecret
     *   }
     * })
     * 
     */
    create<T extends WorkspaceSecretCreateArgs>(args: SelectSubset<T, WorkspaceSecretCreateArgs<ExtArgs>>): Prisma__WorkspaceSecretClient<$Result.GetResult<Prisma.$WorkspaceSecretPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WorkspaceSecrets.
     * @param {WorkspaceSecretCreateManyArgs} args - Arguments to create many WorkspaceSecrets.
     * @example
     * // Create many WorkspaceSecrets
     * const workspaceSecret = await prisma.workspaceSecret.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkspaceSecretCreateManyArgs>(args?: SelectSubset<T, WorkspaceSecretCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkspaceSecrets and returns the data saved in the database.
     * @param {WorkspaceSecretCreateManyAndReturnArgs} args - Arguments to create many WorkspaceSecrets.
     * @example
     * // Create many WorkspaceSecrets
     * const workspaceSecret = await prisma.workspaceSecret.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkspaceSecrets and only return the `id`
     * const workspaceSecretWithIdOnly = await prisma.workspaceSecret.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkspaceSecretCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkspaceSecretCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceSecretPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WorkspaceSecret.
     * @param {WorkspaceSecretDeleteArgs} args - Arguments to delete one WorkspaceSecret.
     * @example
     * // Delete one WorkspaceSecret
     * const WorkspaceSecret = await prisma.workspaceSecret.delete({
     *   where: {
     *     // ... filter to delete one WorkspaceSecret
     *   }
     * })
     * 
     */
    delete<T extends WorkspaceSecretDeleteArgs>(args: SelectSubset<T, WorkspaceSecretDeleteArgs<ExtArgs>>): Prisma__WorkspaceSecretClient<$Result.GetResult<Prisma.$WorkspaceSecretPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WorkspaceSecret.
     * @param {WorkspaceSecretUpdateArgs} args - Arguments to update one WorkspaceSecret.
     * @example
     * // Update one WorkspaceSecret
     * const workspaceSecret = await prisma.workspaceSecret.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkspaceSecretUpdateArgs>(args: SelectSubset<T, WorkspaceSecretUpdateArgs<ExtArgs>>): Prisma__WorkspaceSecretClient<$Result.GetResult<Prisma.$WorkspaceSecretPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WorkspaceSecrets.
     * @param {WorkspaceSecretDeleteManyArgs} args - Arguments to filter WorkspaceSecrets to delete.
     * @example
     * // Delete a few WorkspaceSecrets
     * const { count } = await prisma.workspaceSecret.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkspaceSecretDeleteManyArgs>(args?: SelectSubset<T, WorkspaceSecretDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkspaceSecrets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSecretUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkspaceSecrets
     * const workspaceSecret = await prisma.workspaceSecret.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkspaceSecretUpdateManyArgs>(args: SelectSubset<T, WorkspaceSecretUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkspaceSecrets and returns the data updated in the database.
     * @param {WorkspaceSecretUpdateManyAndReturnArgs} args - Arguments to update many WorkspaceSecrets.
     * @example
     * // Update many WorkspaceSecrets
     * const workspaceSecret = await prisma.workspaceSecret.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WorkspaceSecrets and only return the `id`
     * const workspaceSecretWithIdOnly = await prisma.workspaceSecret.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkspaceSecretUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkspaceSecretUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceSecretPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WorkspaceSecret.
     * @param {WorkspaceSecretUpsertArgs} args - Arguments to update or create a WorkspaceSecret.
     * @example
     * // Update or create a WorkspaceSecret
     * const workspaceSecret = await prisma.workspaceSecret.upsert({
     *   create: {
     *     // ... data to create a WorkspaceSecret
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkspaceSecret we want to update
     *   }
     * })
     */
    upsert<T extends WorkspaceSecretUpsertArgs>(args: SelectSubset<T, WorkspaceSecretUpsertArgs<ExtArgs>>): Prisma__WorkspaceSecretClient<$Result.GetResult<Prisma.$WorkspaceSecretPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WorkspaceSecrets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSecretCountArgs} args - Arguments to filter WorkspaceSecrets to count.
     * @example
     * // Count the number of WorkspaceSecrets
     * const count = await prisma.workspaceSecret.count({
     *   where: {
     *     // ... the filter for the WorkspaceSecrets we want to count
     *   }
     * })
    **/
    count<T extends WorkspaceSecretCountArgs>(
      args?: Subset<T, WorkspaceSecretCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkspaceSecretCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkspaceSecret.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSecretAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkspaceSecretAggregateArgs>(args: Subset<T, WorkspaceSecretAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceSecretAggregateType<T>>

    /**
     * Group by WorkspaceSecret.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSecretGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkspaceSecretGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkspaceSecretGroupByArgs['orderBy'] }
        : { orderBy?: WorkspaceSecretGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkspaceSecretGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceSecretGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkspaceSecret model
   */
  readonly fields: WorkspaceSecretFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkspaceSecret.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkspaceSecretClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkspaceSecret model
   */
  interface WorkspaceSecretFieldRefs {
    readonly id: FieldRef<"WorkspaceSecret", 'String'>
    readonly workspaceId: FieldRef<"WorkspaceSecret", 'String'>
    readonly key: FieldRef<"WorkspaceSecret", 'String'>
    readonly value: FieldRef<"WorkspaceSecret", 'String'>
    readonly createdAt: FieldRef<"WorkspaceSecret", 'DateTime'>
    readonly updatedAt: FieldRef<"WorkspaceSecret", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WorkspaceSecret findUnique
   */
  export type WorkspaceSecretFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSecret
     */
    select?: WorkspaceSecretSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSecret
     */
    omit?: WorkspaceSecretOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSecretInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceSecret to fetch.
     */
    where: WorkspaceSecretWhereUniqueInput
  }

  /**
   * WorkspaceSecret findUniqueOrThrow
   */
  export type WorkspaceSecretFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSecret
     */
    select?: WorkspaceSecretSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSecret
     */
    omit?: WorkspaceSecretOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSecretInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceSecret to fetch.
     */
    where: WorkspaceSecretWhereUniqueInput
  }

  /**
   * WorkspaceSecret findFirst
   */
  export type WorkspaceSecretFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSecret
     */
    select?: WorkspaceSecretSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSecret
     */
    omit?: WorkspaceSecretOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSecretInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceSecret to fetch.
     */
    where?: WorkspaceSecretWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceSecrets to fetch.
     */
    orderBy?: WorkspaceSecretOrderByWithRelationInput | WorkspaceSecretOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkspaceSecrets.
     */
    cursor?: WorkspaceSecretWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceSecrets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceSecrets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceSecrets.
     */
    distinct?: WorkspaceSecretScalarFieldEnum | WorkspaceSecretScalarFieldEnum[]
  }

  /**
   * WorkspaceSecret findFirstOrThrow
   */
  export type WorkspaceSecretFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSecret
     */
    select?: WorkspaceSecretSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSecret
     */
    omit?: WorkspaceSecretOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSecretInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceSecret to fetch.
     */
    where?: WorkspaceSecretWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceSecrets to fetch.
     */
    orderBy?: WorkspaceSecretOrderByWithRelationInput | WorkspaceSecretOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkspaceSecrets.
     */
    cursor?: WorkspaceSecretWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceSecrets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceSecrets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceSecrets.
     */
    distinct?: WorkspaceSecretScalarFieldEnum | WorkspaceSecretScalarFieldEnum[]
  }

  /**
   * WorkspaceSecret findMany
   */
  export type WorkspaceSecretFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSecret
     */
    select?: WorkspaceSecretSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSecret
     */
    omit?: WorkspaceSecretOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSecretInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceSecrets to fetch.
     */
    where?: WorkspaceSecretWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceSecrets to fetch.
     */
    orderBy?: WorkspaceSecretOrderByWithRelationInput | WorkspaceSecretOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkspaceSecrets.
     */
    cursor?: WorkspaceSecretWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceSecrets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceSecrets.
     */
    skip?: number
    distinct?: WorkspaceSecretScalarFieldEnum | WorkspaceSecretScalarFieldEnum[]
  }

  /**
   * WorkspaceSecret create
   */
  export type WorkspaceSecretCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSecret
     */
    select?: WorkspaceSecretSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSecret
     */
    omit?: WorkspaceSecretOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSecretInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkspaceSecret.
     */
    data: XOR<WorkspaceSecretCreateInput, WorkspaceSecretUncheckedCreateInput>
  }

  /**
   * WorkspaceSecret createMany
   */
  export type WorkspaceSecretCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkspaceSecrets.
     */
    data: WorkspaceSecretCreateManyInput | WorkspaceSecretCreateManyInput[]
  }

  /**
   * WorkspaceSecret createManyAndReturn
   */
  export type WorkspaceSecretCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSecret
     */
    select?: WorkspaceSecretSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSecret
     */
    omit?: WorkspaceSecretOmit<ExtArgs> | null
    /**
     * The data used to create many WorkspaceSecrets.
     */
    data: WorkspaceSecretCreateManyInput | WorkspaceSecretCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSecretIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkspaceSecret update
   */
  export type WorkspaceSecretUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSecret
     */
    select?: WorkspaceSecretSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSecret
     */
    omit?: WorkspaceSecretOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSecretInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkspaceSecret.
     */
    data: XOR<WorkspaceSecretUpdateInput, WorkspaceSecretUncheckedUpdateInput>
    /**
     * Choose, which WorkspaceSecret to update.
     */
    where: WorkspaceSecretWhereUniqueInput
  }

  /**
   * WorkspaceSecret updateMany
   */
  export type WorkspaceSecretUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkspaceSecrets.
     */
    data: XOR<WorkspaceSecretUpdateManyMutationInput, WorkspaceSecretUncheckedUpdateManyInput>
    /**
     * Filter which WorkspaceSecrets to update
     */
    where?: WorkspaceSecretWhereInput
    /**
     * Limit how many WorkspaceSecrets to update.
     */
    limit?: number
  }

  /**
   * WorkspaceSecret updateManyAndReturn
   */
  export type WorkspaceSecretUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSecret
     */
    select?: WorkspaceSecretSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSecret
     */
    omit?: WorkspaceSecretOmit<ExtArgs> | null
    /**
     * The data used to update WorkspaceSecrets.
     */
    data: XOR<WorkspaceSecretUpdateManyMutationInput, WorkspaceSecretUncheckedUpdateManyInput>
    /**
     * Filter which WorkspaceSecrets to update
     */
    where?: WorkspaceSecretWhereInput
    /**
     * Limit how many WorkspaceSecrets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSecretIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkspaceSecret upsert
   */
  export type WorkspaceSecretUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSecret
     */
    select?: WorkspaceSecretSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSecret
     */
    omit?: WorkspaceSecretOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSecretInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkspaceSecret to update in case it exists.
     */
    where: WorkspaceSecretWhereUniqueInput
    /**
     * In case the WorkspaceSecret found by the `where` argument doesn't exist, create a new WorkspaceSecret with this data.
     */
    create: XOR<WorkspaceSecretCreateInput, WorkspaceSecretUncheckedCreateInput>
    /**
     * In case the WorkspaceSecret was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkspaceSecretUpdateInput, WorkspaceSecretUncheckedUpdateInput>
  }

  /**
   * WorkspaceSecret delete
   */
  export type WorkspaceSecretDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSecret
     */
    select?: WorkspaceSecretSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSecret
     */
    omit?: WorkspaceSecretOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSecretInclude<ExtArgs> | null
    /**
     * Filter which WorkspaceSecret to delete.
     */
    where: WorkspaceSecretWhereUniqueInput
  }

  /**
   * WorkspaceSecret deleteMany
   */
  export type WorkspaceSecretDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkspaceSecrets to delete
     */
    where?: WorkspaceSecretWhereInput
    /**
     * Limit how many WorkspaceSecrets to delete.
     */
    limit?: number
  }

  /**
   * WorkspaceSecret without action
   */
  export type WorkspaceSecretDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSecret
     */
    select?: WorkspaceSecretSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSecret
     */
    omit?: WorkspaceSecretOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSecretInclude<ExtArgs> | null
  }


  /**
   * Model UserSettings
   */

  export type AggregateUserSettings = {
    _count: UserSettingsCountAggregateOutputType | null
    _avg: UserSettingsAvgAggregateOutputType | null
    _sum: UserSettingsSumAggregateOutputType | null
    _min: UserSettingsMinAggregateOutputType | null
    _max: UserSettingsMaxAggregateOutputType | null
  }

  export type UserSettingsAvgAggregateOutputType = {
    fontSize: number | null
    lineHeight: number | null
    tabSize: number | null
    autoSaveDelay: number | null
  }

  export type UserSettingsSumAggregateOutputType = {
    fontSize: number | null
    lineHeight: number | null
    tabSize: number | null
    autoSaveDelay: number | null
  }

  export type UserSettingsMinAggregateOutputType = {
    id: string | null
    userId: string | null
    theme: string | null
    fontSize: number | null
    fontFamily: string | null
    lineHeight: number | null
    tabSize: number | null
    useSpaces: boolean | null
    autoFormat: boolean | null
    formatOnSave: boolean | null
    autoSave: boolean | null
    autoSaveDelay: number | null
    wordWrap: boolean | null
    minimap: boolean | null
    lineNumbers: boolean | null
  }

  export type UserSettingsMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    theme: string | null
    fontSize: number | null
    fontFamily: string | null
    lineHeight: number | null
    tabSize: number | null
    useSpaces: boolean | null
    autoFormat: boolean | null
    formatOnSave: boolean | null
    autoSave: boolean | null
    autoSaveDelay: number | null
    wordWrap: boolean | null
    minimap: boolean | null
    lineNumbers: boolean | null
  }

  export type UserSettingsCountAggregateOutputType = {
    id: number
    userId: number
    theme: number
    fontSize: number
    fontFamily: number
    lineHeight: number
    tabSize: number
    useSpaces: number
    autoFormat: number
    formatOnSave: number
    autoSave: number
    autoSaveDelay: number
    wordWrap: number
    minimap: number
    lineNumbers: number
    _all: number
  }


  export type UserSettingsAvgAggregateInputType = {
    fontSize?: true
    lineHeight?: true
    tabSize?: true
    autoSaveDelay?: true
  }

  export type UserSettingsSumAggregateInputType = {
    fontSize?: true
    lineHeight?: true
    tabSize?: true
    autoSaveDelay?: true
  }

  export type UserSettingsMinAggregateInputType = {
    id?: true
    userId?: true
    theme?: true
    fontSize?: true
    fontFamily?: true
    lineHeight?: true
    tabSize?: true
    useSpaces?: true
    autoFormat?: true
    formatOnSave?: true
    autoSave?: true
    autoSaveDelay?: true
    wordWrap?: true
    minimap?: true
    lineNumbers?: true
  }

  export type UserSettingsMaxAggregateInputType = {
    id?: true
    userId?: true
    theme?: true
    fontSize?: true
    fontFamily?: true
    lineHeight?: true
    tabSize?: true
    useSpaces?: true
    autoFormat?: true
    formatOnSave?: true
    autoSave?: true
    autoSaveDelay?: true
    wordWrap?: true
    minimap?: true
    lineNumbers?: true
  }

  export type UserSettingsCountAggregateInputType = {
    id?: true
    userId?: true
    theme?: true
    fontSize?: true
    fontFamily?: true
    lineHeight?: true
    tabSize?: true
    useSpaces?: true
    autoFormat?: true
    formatOnSave?: true
    autoSave?: true
    autoSaveDelay?: true
    wordWrap?: true
    minimap?: true
    lineNumbers?: true
    _all?: true
  }

  export type UserSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSettings to aggregate.
     */
    where?: UserSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSettings to fetch.
     */
    orderBy?: UserSettingsOrderByWithRelationInput | UserSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSettings
    **/
    _count?: true | UserSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserSettingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSettingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSettingsMaxAggregateInputType
  }

  export type GetUserSettingsAggregateType<T extends UserSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSettings[P]>
      : GetScalarType<T[P], AggregateUserSettings[P]>
  }




  export type UserSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSettingsWhereInput
    orderBy?: UserSettingsOrderByWithAggregationInput | UserSettingsOrderByWithAggregationInput[]
    by: UserSettingsScalarFieldEnum[] | UserSettingsScalarFieldEnum
    having?: UserSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSettingsCountAggregateInputType | true
    _avg?: UserSettingsAvgAggregateInputType
    _sum?: UserSettingsSumAggregateInputType
    _min?: UserSettingsMinAggregateInputType
    _max?: UserSettingsMaxAggregateInputType
  }

  export type UserSettingsGroupByOutputType = {
    id: string
    userId: string
    theme: string
    fontSize: number
    fontFamily: string
    lineHeight: number
    tabSize: number
    useSpaces: boolean
    autoFormat: boolean
    formatOnSave: boolean
    autoSave: boolean
    autoSaveDelay: number
    wordWrap: boolean
    minimap: boolean
    lineNumbers: boolean
    _count: UserSettingsCountAggregateOutputType | null
    _avg: UserSettingsAvgAggregateOutputType | null
    _sum: UserSettingsSumAggregateOutputType | null
    _min: UserSettingsMinAggregateOutputType | null
    _max: UserSettingsMaxAggregateOutputType | null
  }

  type GetUserSettingsGroupByPayload<T extends UserSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], UserSettingsGroupByOutputType[P]>
        }
      >
    >


  export type UserSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    theme?: boolean
    fontSize?: boolean
    fontFamily?: boolean
    lineHeight?: boolean
    tabSize?: boolean
    useSpaces?: boolean
    autoFormat?: boolean
    formatOnSave?: boolean
    autoSave?: boolean
    autoSaveDelay?: boolean
    wordWrap?: boolean
    minimap?: boolean
    lineNumbers?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSettings"]>

  export type UserSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    theme?: boolean
    fontSize?: boolean
    fontFamily?: boolean
    lineHeight?: boolean
    tabSize?: boolean
    useSpaces?: boolean
    autoFormat?: boolean
    formatOnSave?: boolean
    autoSave?: boolean
    autoSaveDelay?: boolean
    wordWrap?: boolean
    minimap?: boolean
    lineNumbers?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSettings"]>

  export type UserSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    theme?: boolean
    fontSize?: boolean
    fontFamily?: boolean
    lineHeight?: boolean
    tabSize?: boolean
    useSpaces?: boolean
    autoFormat?: boolean
    formatOnSave?: boolean
    autoSave?: boolean
    autoSaveDelay?: boolean
    wordWrap?: boolean
    minimap?: boolean
    lineNumbers?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSettings"]>

  export type UserSettingsSelectScalar = {
    id?: boolean
    userId?: boolean
    theme?: boolean
    fontSize?: boolean
    fontFamily?: boolean
    lineHeight?: boolean
    tabSize?: boolean
    useSpaces?: boolean
    autoFormat?: boolean
    formatOnSave?: boolean
    autoSave?: boolean
    autoSaveDelay?: boolean
    wordWrap?: boolean
    minimap?: boolean
    lineNumbers?: boolean
  }

  export type UserSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "theme" | "fontSize" | "fontFamily" | "lineHeight" | "tabSize" | "useSpaces" | "autoFormat" | "formatOnSave" | "autoSave" | "autoSaveDelay" | "wordWrap" | "minimap" | "lineNumbers", ExtArgs["result"]["userSettings"]>
  export type UserSettingsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserSettingsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserSettingsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSettings"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      theme: string
      fontSize: number
      fontFamily: string
      lineHeight: number
      tabSize: number
      useSpaces: boolean
      autoFormat: boolean
      formatOnSave: boolean
      autoSave: boolean
      autoSaveDelay: number
      wordWrap: boolean
      minimap: boolean
      lineNumbers: boolean
    }, ExtArgs["result"]["userSettings"]>
    composites: {}
  }

  type UserSettingsGetPayload<S extends boolean | null | undefined | UserSettingsDefaultArgs> = $Result.GetResult<Prisma.$UserSettingsPayload, S>

  type UserSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserSettingsCountAggregateInputType | true
    }

  export interface UserSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSettings'], meta: { name: 'UserSettings' } }
    /**
     * Find zero or one UserSettings that matches the filter.
     * @param {UserSettingsFindUniqueArgs} args - Arguments to find a UserSettings
     * @example
     * // Get one UserSettings
     * const userSettings = await prisma.userSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserSettingsFindUniqueArgs>(args: SelectSubset<T, UserSettingsFindUniqueArgs<ExtArgs>>): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserSettingsFindUniqueOrThrowArgs} args - Arguments to find a UserSettings
     * @example
     * // Get one UserSettings
     * const userSettings = await prisma.userSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, UserSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsFindFirstArgs} args - Arguments to find a UserSettings
     * @example
     * // Get one UserSettings
     * const userSettings = await prisma.userSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserSettingsFindFirstArgs>(args?: SelectSubset<T, UserSettingsFindFirstArgs<ExtArgs>>): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsFindFirstOrThrowArgs} args - Arguments to find a UserSettings
     * @example
     * // Get one UserSettings
     * const userSettings = await prisma.userSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, UserSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSettings
     * const userSettings = await prisma.userSettings.findMany()
     * 
     * // Get first 10 UserSettings
     * const userSettings = await prisma.userSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSettingsWithIdOnly = await prisma.userSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserSettingsFindManyArgs>(args?: SelectSubset<T, UserSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserSettings.
     * @param {UserSettingsCreateArgs} args - Arguments to create a UserSettings.
     * @example
     * // Create one UserSettings
     * const UserSettings = await prisma.userSettings.create({
     *   data: {
     *     // ... data to create a UserSettings
     *   }
     * })
     * 
     */
    create<T extends UserSettingsCreateArgs>(args: SelectSubset<T, UserSettingsCreateArgs<ExtArgs>>): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserSettings.
     * @param {UserSettingsCreateManyArgs} args - Arguments to create many UserSettings.
     * @example
     * // Create many UserSettings
     * const userSettings = await prisma.userSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserSettingsCreateManyArgs>(args?: SelectSubset<T, UserSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserSettings and returns the data saved in the database.
     * @param {UserSettingsCreateManyAndReturnArgs} args - Arguments to create many UserSettings.
     * @example
     * // Create many UserSettings
     * const userSettings = await prisma.userSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserSettings and only return the `id`
     * const userSettingsWithIdOnly = await prisma.userSettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, UserSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserSettings.
     * @param {UserSettingsDeleteArgs} args - Arguments to delete one UserSettings.
     * @example
     * // Delete one UserSettings
     * const UserSettings = await prisma.userSettings.delete({
     *   where: {
     *     // ... filter to delete one UserSettings
     *   }
     * })
     * 
     */
    delete<T extends UserSettingsDeleteArgs>(args: SelectSubset<T, UserSettingsDeleteArgs<ExtArgs>>): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserSettings.
     * @param {UserSettingsUpdateArgs} args - Arguments to update one UserSettings.
     * @example
     * // Update one UserSettings
     * const userSettings = await prisma.userSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserSettingsUpdateArgs>(args: SelectSubset<T, UserSettingsUpdateArgs<ExtArgs>>): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserSettings.
     * @param {UserSettingsDeleteManyArgs} args - Arguments to filter UserSettings to delete.
     * @example
     * // Delete a few UserSettings
     * const { count } = await prisma.userSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserSettingsDeleteManyArgs>(args?: SelectSubset<T, UserSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSettings
     * const userSettings = await prisma.userSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserSettingsUpdateManyArgs>(args: SelectSubset<T, UserSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSettings and returns the data updated in the database.
     * @param {UserSettingsUpdateManyAndReturnArgs} args - Arguments to update many UserSettings.
     * @example
     * // Update many UserSettings
     * const userSettings = await prisma.userSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserSettings and only return the `id`
     * const userSettingsWithIdOnly = await prisma.userSettings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, UserSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserSettings.
     * @param {UserSettingsUpsertArgs} args - Arguments to update or create a UserSettings.
     * @example
     * // Update or create a UserSettings
     * const userSettings = await prisma.userSettings.upsert({
     *   create: {
     *     // ... data to create a UserSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSettings we want to update
     *   }
     * })
     */
    upsert<T extends UserSettingsUpsertArgs>(args: SelectSubset<T, UserSettingsUpsertArgs<ExtArgs>>): Prisma__UserSettingsClient<$Result.GetResult<Prisma.$UserSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsCountArgs} args - Arguments to filter UserSettings to count.
     * @example
     * // Count the number of UserSettings
     * const count = await prisma.userSettings.count({
     *   where: {
     *     // ... the filter for the UserSettings we want to count
     *   }
     * })
    **/
    count<T extends UserSettingsCountArgs>(
      args?: Subset<T, UserSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserSettingsAggregateArgs>(args: Subset<T, UserSettingsAggregateArgs>): Prisma.PrismaPromise<GetUserSettingsAggregateType<T>>

    /**
     * Group by UserSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSettingsGroupByArgs['orderBy'] }
        : { orderBy?: UserSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSettings model
   */
  readonly fields: UserSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserSettings model
   */
  interface UserSettingsFieldRefs {
    readonly id: FieldRef<"UserSettings", 'String'>
    readonly userId: FieldRef<"UserSettings", 'String'>
    readonly theme: FieldRef<"UserSettings", 'String'>
    readonly fontSize: FieldRef<"UserSettings", 'Int'>
    readonly fontFamily: FieldRef<"UserSettings", 'String'>
    readonly lineHeight: FieldRef<"UserSettings", 'Float'>
    readonly tabSize: FieldRef<"UserSettings", 'Int'>
    readonly useSpaces: FieldRef<"UserSettings", 'Boolean'>
    readonly autoFormat: FieldRef<"UserSettings", 'Boolean'>
    readonly formatOnSave: FieldRef<"UserSettings", 'Boolean'>
    readonly autoSave: FieldRef<"UserSettings", 'Boolean'>
    readonly autoSaveDelay: FieldRef<"UserSettings", 'Int'>
    readonly wordWrap: FieldRef<"UserSettings", 'Boolean'>
    readonly minimap: FieldRef<"UserSettings", 'Boolean'>
    readonly lineNumbers: FieldRef<"UserSettings", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * UserSettings findUnique
   */
  export type UserSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSettings
     */
    omit?: UserSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserSettings to fetch.
     */
    where: UserSettingsWhereUniqueInput
  }

  /**
   * UserSettings findUniqueOrThrow
   */
  export type UserSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSettings
     */
    omit?: UserSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserSettings to fetch.
     */
    where: UserSettingsWhereUniqueInput
  }

  /**
   * UserSettings findFirst
   */
  export type UserSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSettings
     */
    omit?: UserSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserSettings to fetch.
     */
    where?: UserSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSettings to fetch.
     */
    orderBy?: UserSettingsOrderByWithRelationInput | UserSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSettings.
     */
    cursor?: UserSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSettings.
     */
    distinct?: UserSettingsScalarFieldEnum | UserSettingsScalarFieldEnum[]
  }

  /**
   * UserSettings findFirstOrThrow
   */
  export type UserSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSettings
     */
    omit?: UserSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserSettings to fetch.
     */
    where?: UserSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSettings to fetch.
     */
    orderBy?: UserSettingsOrderByWithRelationInput | UserSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSettings.
     */
    cursor?: UserSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSettings.
     */
    distinct?: UserSettingsScalarFieldEnum | UserSettingsScalarFieldEnum[]
  }

  /**
   * UserSettings findMany
   */
  export type UserSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSettings
     */
    omit?: UserSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserSettings to fetch.
     */
    where?: UserSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSettings to fetch.
     */
    orderBy?: UserSettingsOrderByWithRelationInput | UserSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSettings.
     */
    cursor?: UserSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSettings.
     */
    skip?: number
    distinct?: UserSettingsScalarFieldEnum | UserSettingsScalarFieldEnum[]
  }

  /**
   * UserSettings create
   */
  export type UserSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSettings
     */
    omit?: UserSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * The data needed to create a UserSettings.
     */
    data: XOR<UserSettingsCreateInput, UserSettingsUncheckedCreateInput>
  }

  /**
   * UserSettings createMany
   */
  export type UserSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSettings.
     */
    data: UserSettingsCreateManyInput | UserSettingsCreateManyInput[]
  }

  /**
   * UserSettings createManyAndReturn
   */
  export type UserSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSettings
     */
    omit?: UserSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many UserSettings.
     */
    data: UserSettingsCreateManyInput | UserSettingsCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSettings update
   */
  export type UserSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSettings
     */
    omit?: UserSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * The data needed to update a UserSettings.
     */
    data: XOR<UserSettingsUpdateInput, UserSettingsUncheckedUpdateInput>
    /**
     * Choose, which UserSettings to update.
     */
    where: UserSettingsWhereUniqueInput
  }

  /**
   * UserSettings updateMany
   */
  export type UserSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSettings.
     */
    data: XOR<UserSettingsUpdateManyMutationInput, UserSettingsUncheckedUpdateManyInput>
    /**
     * Filter which UserSettings to update
     */
    where?: UserSettingsWhereInput
    /**
     * Limit how many UserSettings to update.
     */
    limit?: number
  }

  /**
   * UserSettings updateManyAndReturn
   */
  export type UserSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSettings
     */
    omit?: UserSettingsOmit<ExtArgs> | null
    /**
     * The data used to update UserSettings.
     */
    data: XOR<UserSettingsUpdateManyMutationInput, UserSettingsUncheckedUpdateManyInput>
    /**
     * Filter which UserSettings to update
     */
    where?: UserSettingsWhereInput
    /**
     * Limit how many UserSettings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSettings upsert
   */
  export type UserSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSettings
     */
    omit?: UserSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * The filter to search for the UserSettings to update in case it exists.
     */
    where: UserSettingsWhereUniqueInput
    /**
     * In case the UserSettings found by the `where` argument doesn't exist, create a new UserSettings with this data.
     */
    create: XOR<UserSettingsCreateInput, UserSettingsUncheckedCreateInput>
    /**
     * In case the UserSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSettingsUpdateInput, UserSettingsUncheckedUpdateInput>
  }

  /**
   * UserSettings delete
   */
  export type UserSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSettings
     */
    omit?: UserSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingsInclude<ExtArgs> | null
    /**
     * Filter which UserSettings to delete.
     */
    where: UserSettingsWhereUniqueInput
  }

  /**
   * UserSettings deleteMany
   */
  export type UserSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSettings to delete
     */
    where?: UserSettingsWhereInput
    /**
     * Limit how many UserSettings to delete.
     */
    limit?: number
  }

  /**
   * UserSettings without action
   */
  export type UserSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSettings
     */
    select?: UserSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSettings
     */
    omit?: UserSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSettingsInclude<ExtArgs> | null
  }


  /**
   * Model WorkspaceSettings
   */

  export type AggregateWorkspaceSettings = {
    _count: WorkspaceSettingsCountAggregateOutputType | null
    _min: WorkspaceSettingsMinAggregateOutputType | null
    _max: WorkspaceSettingsMaxAggregateOutputType | null
  }

  export type WorkspaceSettingsMinAggregateOutputType = {
    workspaceId: string | null
    settings: string | null
  }

  export type WorkspaceSettingsMaxAggregateOutputType = {
    workspaceId: string | null
    settings: string | null
  }

  export type WorkspaceSettingsCountAggregateOutputType = {
    workspaceId: number
    settings: number
    _all: number
  }


  export type WorkspaceSettingsMinAggregateInputType = {
    workspaceId?: true
    settings?: true
  }

  export type WorkspaceSettingsMaxAggregateInputType = {
    workspaceId?: true
    settings?: true
  }

  export type WorkspaceSettingsCountAggregateInputType = {
    workspaceId?: true
    settings?: true
    _all?: true
  }

  export type WorkspaceSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkspaceSettings to aggregate.
     */
    where?: WorkspaceSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceSettings to fetch.
     */
    orderBy?: WorkspaceSettingsOrderByWithRelationInput | WorkspaceSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkspaceSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkspaceSettings
    **/
    _count?: true | WorkspaceSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkspaceSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkspaceSettingsMaxAggregateInputType
  }

  export type GetWorkspaceSettingsAggregateType<T extends WorkspaceSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkspaceSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkspaceSettings[P]>
      : GetScalarType<T[P], AggregateWorkspaceSettings[P]>
  }




  export type WorkspaceSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceSettingsWhereInput
    orderBy?: WorkspaceSettingsOrderByWithAggregationInput | WorkspaceSettingsOrderByWithAggregationInput[]
    by: WorkspaceSettingsScalarFieldEnum[] | WorkspaceSettingsScalarFieldEnum
    having?: WorkspaceSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkspaceSettingsCountAggregateInputType | true
    _min?: WorkspaceSettingsMinAggregateInputType
    _max?: WorkspaceSettingsMaxAggregateInputType
  }

  export type WorkspaceSettingsGroupByOutputType = {
    workspaceId: string
    settings: string
    _count: WorkspaceSettingsCountAggregateOutputType | null
    _min: WorkspaceSettingsMinAggregateOutputType | null
    _max: WorkspaceSettingsMaxAggregateOutputType | null
  }

  type GetWorkspaceSettingsGroupByPayload<T extends WorkspaceSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkspaceSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkspaceSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkspaceSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], WorkspaceSettingsGroupByOutputType[P]>
        }
      >
    >


  export type WorkspaceSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    workspaceId?: boolean
    settings?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceSettings"]>

  export type WorkspaceSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    workspaceId?: boolean
    settings?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceSettings"]>

  export type WorkspaceSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    workspaceId?: boolean
    settings?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspaceSettings"]>

  export type WorkspaceSettingsSelectScalar = {
    workspaceId?: boolean
    settings?: boolean
  }

  export type WorkspaceSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"workspaceId" | "settings", ExtArgs["result"]["workspaceSettings"]>
  export type WorkspaceSettingsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type WorkspaceSettingsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type WorkspaceSettingsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }

  export type $WorkspaceSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkspaceSettings"
    objects: {
      workspace: Prisma.$WorkspacePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      workspaceId: string
      settings: string
    }, ExtArgs["result"]["workspaceSettings"]>
    composites: {}
  }

  type WorkspaceSettingsGetPayload<S extends boolean | null | undefined | WorkspaceSettingsDefaultArgs> = $Result.GetResult<Prisma.$WorkspaceSettingsPayload, S>

  type WorkspaceSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkspaceSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkspaceSettingsCountAggregateInputType | true
    }

  export interface WorkspaceSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkspaceSettings'], meta: { name: 'WorkspaceSettings' } }
    /**
     * Find zero or one WorkspaceSettings that matches the filter.
     * @param {WorkspaceSettingsFindUniqueArgs} args - Arguments to find a WorkspaceSettings
     * @example
     * // Get one WorkspaceSettings
     * const workspaceSettings = await prisma.workspaceSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkspaceSettingsFindUniqueArgs>(args: SelectSubset<T, WorkspaceSettingsFindUniqueArgs<ExtArgs>>): Prisma__WorkspaceSettingsClient<$Result.GetResult<Prisma.$WorkspaceSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WorkspaceSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkspaceSettingsFindUniqueOrThrowArgs} args - Arguments to find a WorkspaceSettings
     * @example
     * // Get one WorkspaceSettings
     * const workspaceSettings = await prisma.workspaceSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkspaceSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkspaceSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkspaceSettingsClient<$Result.GetResult<Prisma.$WorkspaceSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkspaceSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSettingsFindFirstArgs} args - Arguments to find a WorkspaceSettings
     * @example
     * // Get one WorkspaceSettings
     * const workspaceSettings = await prisma.workspaceSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkspaceSettingsFindFirstArgs>(args?: SelectSubset<T, WorkspaceSettingsFindFirstArgs<ExtArgs>>): Prisma__WorkspaceSettingsClient<$Result.GetResult<Prisma.$WorkspaceSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkspaceSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSettingsFindFirstOrThrowArgs} args - Arguments to find a WorkspaceSettings
     * @example
     * // Get one WorkspaceSettings
     * const workspaceSettings = await prisma.workspaceSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkspaceSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkspaceSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkspaceSettingsClient<$Result.GetResult<Prisma.$WorkspaceSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WorkspaceSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkspaceSettings
     * const workspaceSettings = await prisma.workspaceSettings.findMany()
     * 
     * // Get first 10 WorkspaceSettings
     * const workspaceSettings = await prisma.workspaceSettings.findMany({ take: 10 })
     * 
     * // Only select the `workspaceId`
     * const workspaceSettingsWithWorkspaceIdOnly = await prisma.workspaceSettings.findMany({ select: { workspaceId: true } })
     * 
     */
    findMany<T extends WorkspaceSettingsFindManyArgs>(args?: SelectSubset<T, WorkspaceSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WorkspaceSettings.
     * @param {WorkspaceSettingsCreateArgs} args - Arguments to create a WorkspaceSettings.
     * @example
     * // Create one WorkspaceSettings
     * const WorkspaceSettings = await prisma.workspaceSettings.create({
     *   data: {
     *     // ... data to create a WorkspaceSettings
     *   }
     * })
     * 
     */
    create<T extends WorkspaceSettingsCreateArgs>(args: SelectSubset<T, WorkspaceSettingsCreateArgs<ExtArgs>>): Prisma__WorkspaceSettingsClient<$Result.GetResult<Prisma.$WorkspaceSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WorkspaceSettings.
     * @param {WorkspaceSettingsCreateManyArgs} args - Arguments to create many WorkspaceSettings.
     * @example
     * // Create many WorkspaceSettings
     * const workspaceSettings = await prisma.workspaceSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkspaceSettingsCreateManyArgs>(args?: SelectSubset<T, WorkspaceSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkspaceSettings and returns the data saved in the database.
     * @param {WorkspaceSettingsCreateManyAndReturnArgs} args - Arguments to create many WorkspaceSettings.
     * @example
     * // Create many WorkspaceSettings
     * const workspaceSettings = await prisma.workspaceSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkspaceSettings and only return the `workspaceId`
     * const workspaceSettingsWithWorkspaceIdOnly = await prisma.workspaceSettings.createManyAndReturn({
     *   select: { workspaceId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkspaceSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkspaceSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WorkspaceSettings.
     * @param {WorkspaceSettingsDeleteArgs} args - Arguments to delete one WorkspaceSettings.
     * @example
     * // Delete one WorkspaceSettings
     * const WorkspaceSettings = await prisma.workspaceSettings.delete({
     *   where: {
     *     // ... filter to delete one WorkspaceSettings
     *   }
     * })
     * 
     */
    delete<T extends WorkspaceSettingsDeleteArgs>(args: SelectSubset<T, WorkspaceSettingsDeleteArgs<ExtArgs>>): Prisma__WorkspaceSettingsClient<$Result.GetResult<Prisma.$WorkspaceSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WorkspaceSettings.
     * @param {WorkspaceSettingsUpdateArgs} args - Arguments to update one WorkspaceSettings.
     * @example
     * // Update one WorkspaceSettings
     * const workspaceSettings = await prisma.workspaceSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkspaceSettingsUpdateArgs>(args: SelectSubset<T, WorkspaceSettingsUpdateArgs<ExtArgs>>): Prisma__WorkspaceSettingsClient<$Result.GetResult<Prisma.$WorkspaceSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WorkspaceSettings.
     * @param {WorkspaceSettingsDeleteManyArgs} args - Arguments to filter WorkspaceSettings to delete.
     * @example
     * // Delete a few WorkspaceSettings
     * const { count } = await prisma.workspaceSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkspaceSettingsDeleteManyArgs>(args?: SelectSubset<T, WorkspaceSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkspaceSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkspaceSettings
     * const workspaceSettings = await prisma.workspaceSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkspaceSettingsUpdateManyArgs>(args: SelectSubset<T, WorkspaceSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkspaceSettings and returns the data updated in the database.
     * @param {WorkspaceSettingsUpdateManyAndReturnArgs} args - Arguments to update many WorkspaceSettings.
     * @example
     * // Update many WorkspaceSettings
     * const workspaceSettings = await prisma.workspaceSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WorkspaceSettings and only return the `workspaceId`
     * const workspaceSettingsWithWorkspaceIdOnly = await prisma.workspaceSettings.updateManyAndReturn({
     *   select: { workspaceId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkspaceSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkspaceSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspaceSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WorkspaceSettings.
     * @param {WorkspaceSettingsUpsertArgs} args - Arguments to update or create a WorkspaceSettings.
     * @example
     * // Update or create a WorkspaceSettings
     * const workspaceSettings = await prisma.workspaceSettings.upsert({
     *   create: {
     *     // ... data to create a WorkspaceSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkspaceSettings we want to update
     *   }
     * })
     */
    upsert<T extends WorkspaceSettingsUpsertArgs>(args: SelectSubset<T, WorkspaceSettingsUpsertArgs<ExtArgs>>): Prisma__WorkspaceSettingsClient<$Result.GetResult<Prisma.$WorkspaceSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WorkspaceSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSettingsCountArgs} args - Arguments to filter WorkspaceSettings to count.
     * @example
     * // Count the number of WorkspaceSettings
     * const count = await prisma.workspaceSettings.count({
     *   where: {
     *     // ... the filter for the WorkspaceSettings we want to count
     *   }
     * })
    **/
    count<T extends WorkspaceSettingsCountArgs>(
      args?: Subset<T, WorkspaceSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkspaceSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkspaceSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkspaceSettingsAggregateArgs>(args: Subset<T, WorkspaceSettingsAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceSettingsAggregateType<T>>

    /**
     * Group by WorkspaceSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkspaceSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkspaceSettingsGroupByArgs['orderBy'] }
        : { orderBy?: WorkspaceSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkspaceSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkspaceSettings model
   */
  readonly fields: WorkspaceSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkspaceSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkspaceSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkspaceSettings model
   */
  interface WorkspaceSettingsFieldRefs {
    readonly workspaceId: FieldRef<"WorkspaceSettings", 'String'>
    readonly settings: FieldRef<"WorkspaceSettings", 'String'>
  }
    

  // Custom InputTypes
  /**
   * WorkspaceSettings findUnique
   */
  export type WorkspaceSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSettings
     */
    select?: WorkspaceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSettings
     */
    omit?: WorkspaceSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSettingsInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceSettings to fetch.
     */
    where: WorkspaceSettingsWhereUniqueInput
  }

  /**
   * WorkspaceSettings findUniqueOrThrow
   */
  export type WorkspaceSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSettings
     */
    select?: WorkspaceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSettings
     */
    omit?: WorkspaceSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSettingsInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceSettings to fetch.
     */
    where: WorkspaceSettingsWhereUniqueInput
  }

  /**
   * WorkspaceSettings findFirst
   */
  export type WorkspaceSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSettings
     */
    select?: WorkspaceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSettings
     */
    omit?: WorkspaceSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSettingsInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceSettings to fetch.
     */
    where?: WorkspaceSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceSettings to fetch.
     */
    orderBy?: WorkspaceSettingsOrderByWithRelationInput | WorkspaceSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkspaceSettings.
     */
    cursor?: WorkspaceSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceSettings.
     */
    distinct?: WorkspaceSettingsScalarFieldEnum | WorkspaceSettingsScalarFieldEnum[]
  }

  /**
   * WorkspaceSettings findFirstOrThrow
   */
  export type WorkspaceSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSettings
     */
    select?: WorkspaceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSettings
     */
    omit?: WorkspaceSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSettingsInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceSettings to fetch.
     */
    where?: WorkspaceSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceSettings to fetch.
     */
    orderBy?: WorkspaceSettingsOrderByWithRelationInput | WorkspaceSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkspaceSettings.
     */
    cursor?: WorkspaceSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkspaceSettings.
     */
    distinct?: WorkspaceSettingsScalarFieldEnum | WorkspaceSettingsScalarFieldEnum[]
  }

  /**
   * WorkspaceSettings findMany
   */
  export type WorkspaceSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSettings
     */
    select?: WorkspaceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSettings
     */
    omit?: WorkspaceSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSettingsInclude<ExtArgs> | null
    /**
     * Filter, which WorkspaceSettings to fetch.
     */
    where?: WorkspaceSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkspaceSettings to fetch.
     */
    orderBy?: WorkspaceSettingsOrderByWithRelationInput | WorkspaceSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkspaceSettings.
     */
    cursor?: WorkspaceSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkspaceSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkspaceSettings.
     */
    skip?: number
    distinct?: WorkspaceSettingsScalarFieldEnum | WorkspaceSettingsScalarFieldEnum[]
  }

  /**
   * WorkspaceSettings create
   */
  export type WorkspaceSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSettings
     */
    select?: WorkspaceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSettings
     */
    omit?: WorkspaceSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSettingsInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkspaceSettings.
     */
    data: XOR<WorkspaceSettingsCreateInput, WorkspaceSettingsUncheckedCreateInput>
  }

  /**
   * WorkspaceSettings createMany
   */
  export type WorkspaceSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkspaceSettings.
     */
    data: WorkspaceSettingsCreateManyInput | WorkspaceSettingsCreateManyInput[]
  }

  /**
   * WorkspaceSettings createManyAndReturn
   */
  export type WorkspaceSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSettings
     */
    select?: WorkspaceSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSettings
     */
    omit?: WorkspaceSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many WorkspaceSettings.
     */
    data: WorkspaceSettingsCreateManyInput | WorkspaceSettingsCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSettingsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkspaceSettings update
   */
  export type WorkspaceSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSettings
     */
    select?: WorkspaceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSettings
     */
    omit?: WorkspaceSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSettingsInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkspaceSettings.
     */
    data: XOR<WorkspaceSettingsUpdateInput, WorkspaceSettingsUncheckedUpdateInput>
    /**
     * Choose, which WorkspaceSettings to update.
     */
    where: WorkspaceSettingsWhereUniqueInput
  }

  /**
   * WorkspaceSettings updateMany
   */
  export type WorkspaceSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkspaceSettings.
     */
    data: XOR<WorkspaceSettingsUpdateManyMutationInput, WorkspaceSettingsUncheckedUpdateManyInput>
    /**
     * Filter which WorkspaceSettings to update
     */
    where?: WorkspaceSettingsWhereInput
    /**
     * Limit how many WorkspaceSettings to update.
     */
    limit?: number
  }

  /**
   * WorkspaceSettings updateManyAndReturn
   */
  export type WorkspaceSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSettings
     */
    select?: WorkspaceSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSettings
     */
    omit?: WorkspaceSettingsOmit<ExtArgs> | null
    /**
     * The data used to update WorkspaceSettings.
     */
    data: XOR<WorkspaceSettingsUpdateManyMutationInput, WorkspaceSettingsUncheckedUpdateManyInput>
    /**
     * Filter which WorkspaceSettings to update
     */
    where?: WorkspaceSettingsWhereInput
    /**
     * Limit how many WorkspaceSettings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSettingsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WorkspaceSettings upsert
   */
  export type WorkspaceSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSettings
     */
    select?: WorkspaceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSettings
     */
    omit?: WorkspaceSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSettingsInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkspaceSettings to update in case it exists.
     */
    where: WorkspaceSettingsWhereUniqueInput
    /**
     * In case the WorkspaceSettings found by the `where` argument doesn't exist, create a new WorkspaceSettings with this data.
     */
    create: XOR<WorkspaceSettingsCreateInput, WorkspaceSettingsUncheckedCreateInput>
    /**
     * In case the WorkspaceSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkspaceSettingsUpdateInput, WorkspaceSettingsUncheckedUpdateInput>
  }

  /**
   * WorkspaceSettings delete
   */
  export type WorkspaceSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSettings
     */
    select?: WorkspaceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSettings
     */
    omit?: WorkspaceSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSettingsInclude<ExtArgs> | null
    /**
     * Filter which WorkspaceSettings to delete.
     */
    where: WorkspaceSettingsWhereUniqueInput
  }

  /**
   * WorkspaceSettings deleteMany
   */
  export type WorkspaceSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkspaceSettings to delete
     */
    where?: WorkspaceSettingsWhereInput
    /**
     * Limit how many WorkspaceSettings to delete.
     */
    limit?: number
  }

  /**
   * WorkspaceSettings without action
   */
  export type WorkspaceSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceSettings
     */
    select?: WorkspaceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkspaceSettings
     */
    omit?: WorkspaceSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceSettingsInclude<ExtArgs> | null
  }


  /**
   * Model EditorState
   */

  export type AggregateEditorState = {
    _count: EditorStateCountAggregateOutputType | null
    _min: EditorStateMinAggregateOutputType | null
    _max: EditorStateMaxAggregateOutputType | null
  }

  export type EditorStateMinAggregateOutputType = {
    workspaceId: string | null
    activeTabId: string | null
    lastSaved: Date | null
  }

  export type EditorStateMaxAggregateOutputType = {
    workspaceId: string | null
    activeTabId: string | null
    lastSaved: Date | null
  }

  export type EditorStateCountAggregateOutputType = {
    workspaceId: number
    activeTabId: number
    lastSaved: number
    _all: number
  }


  export type EditorStateMinAggregateInputType = {
    workspaceId?: true
    activeTabId?: true
    lastSaved?: true
  }

  export type EditorStateMaxAggregateInputType = {
    workspaceId?: true
    activeTabId?: true
    lastSaved?: true
  }

  export type EditorStateCountAggregateInputType = {
    workspaceId?: true
    activeTabId?: true
    lastSaved?: true
    _all?: true
  }

  export type EditorStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EditorState to aggregate.
     */
    where?: EditorStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EditorStates to fetch.
     */
    orderBy?: EditorStateOrderByWithRelationInput | EditorStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EditorStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EditorStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EditorStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EditorStates
    **/
    _count?: true | EditorStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EditorStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EditorStateMaxAggregateInputType
  }

  export type GetEditorStateAggregateType<T extends EditorStateAggregateArgs> = {
        [P in keyof T & keyof AggregateEditorState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEditorState[P]>
      : GetScalarType<T[P], AggregateEditorState[P]>
  }




  export type EditorStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EditorStateWhereInput
    orderBy?: EditorStateOrderByWithAggregationInput | EditorStateOrderByWithAggregationInput[]
    by: EditorStateScalarFieldEnum[] | EditorStateScalarFieldEnum
    having?: EditorStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EditorStateCountAggregateInputType | true
    _min?: EditorStateMinAggregateInputType
    _max?: EditorStateMaxAggregateInputType
  }

  export type EditorStateGroupByOutputType = {
    workspaceId: string
    activeTabId: string | null
    lastSaved: Date | null
    _count: EditorStateCountAggregateOutputType | null
    _min: EditorStateMinAggregateOutputType | null
    _max: EditorStateMaxAggregateOutputType | null
  }

  type GetEditorStateGroupByPayload<T extends EditorStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EditorStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EditorStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EditorStateGroupByOutputType[P]>
            : GetScalarType<T[P], EditorStateGroupByOutputType[P]>
        }
      >
    >


  export type EditorStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    workspaceId?: boolean
    activeTabId?: boolean
    lastSaved?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    tabs?: boolean | EditorState$tabsArgs<ExtArgs>
    _count?: boolean | EditorStateCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["editorState"]>

  export type EditorStateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    workspaceId?: boolean
    activeTabId?: boolean
    lastSaved?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["editorState"]>

  export type EditorStateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    workspaceId?: boolean
    activeTabId?: boolean
    lastSaved?: boolean
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["editorState"]>

  export type EditorStateSelectScalar = {
    workspaceId?: boolean
    activeTabId?: boolean
    lastSaved?: boolean
  }

  export type EditorStateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"workspaceId" | "activeTabId" | "lastSaved", ExtArgs["result"]["editorState"]>
  export type EditorStateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    tabs?: boolean | EditorState$tabsArgs<ExtArgs>
    _count?: boolean | EditorStateCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EditorStateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }
  export type EditorStateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }

  export type $EditorStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EditorState"
    objects: {
      workspace: Prisma.$WorkspacePayload<ExtArgs>
      tabs: Prisma.$TabStatePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      workspaceId: string
      activeTabId: string | null
      lastSaved: Date | null
    }, ExtArgs["result"]["editorState"]>
    composites: {}
  }

  type EditorStateGetPayload<S extends boolean | null | undefined | EditorStateDefaultArgs> = $Result.GetResult<Prisma.$EditorStatePayload, S>

  type EditorStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EditorStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EditorStateCountAggregateInputType | true
    }

  export interface EditorStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EditorState'], meta: { name: 'EditorState' } }
    /**
     * Find zero or one EditorState that matches the filter.
     * @param {EditorStateFindUniqueArgs} args - Arguments to find a EditorState
     * @example
     * // Get one EditorState
     * const editorState = await prisma.editorState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EditorStateFindUniqueArgs>(args: SelectSubset<T, EditorStateFindUniqueArgs<ExtArgs>>): Prisma__EditorStateClient<$Result.GetResult<Prisma.$EditorStatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EditorState that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EditorStateFindUniqueOrThrowArgs} args - Arguments to find a EditorState
     * @example
     * // Get one EditorState
     * const editorState = await prisma.editorState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EditorStateFindUniqueOrThrowArgs>(args: SelectSubset<T, EditorStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EditorStateClient<$Result.GetResult<Prisma.$EditorStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EditorState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EditorStateFindFirstArgs} args - Arguments to find a EditorState
     * @example
     * // Get one EditorState
     * const editorState = await prisma.editorState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EditorStateFindFirstArgs>(args?: SelectSubset<T, EditorStateFindFirstArgs<ExtArgs>>): Prisma__EditorStateClient<$Result.GetResult<Prisma.$EditorStatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EditorState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EditorStateFindFirstOrThrowArgs} args - Arguments to find a EditorState
     * @example
     * // Get one EditorState
     * const editorState = await prisma.editorState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EditorStateFindFirstOrThrowArgs>(args?: SelectSubset<T, EditorStateFindFirstOrThrowArgs<ExtArgs>>): Prisma__EditorStateClient<$Result.GetResult<Prisma.$EditorStatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EditorStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EditorStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EditorStates
     * const editorStates = await prisma.editorState.findMany()
     * 
     * // Get first 10 EditorStates
     * const editorStates = await prisma.editorState.findMany({ take: 10 })
     * 
     * // Only select the `workspaceId`
     * const editorStateWithWorkspaceIdOnly = await prisma.editorState.findMany({ select: { workspaceId: true } })
     * 
     */
    findMany<T extends EditorStateFindManyArgs>(args?: SelectSubset<T, EditorStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EditorStatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EditorState.
     * @param {EditorStateCreateArgs} args - Arguments to create a EditorState.
     * @example
     * // Create one EditorState
     * const EditorState = await prisma.editorState.create({
     *   data: {
     *     // ... data to create a EditorState
     *   }
     * })
     * 
     */
    create<T extends EditorStateCreateArgs>(args: SelectSubset<T, EditorStateCreateArgs<ExtArgs>>): Prisma__EditorStateClient<$Result.GetResult<Prisma.$EditorStatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EditorStates.
     * @param {EditorStateCreateManyArgs} args - Arguments to create many EditorStates.
     * @example
     * // Create many EditorStates
     * const editorState = await prisma.editorState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EditorStateCreateManyArgs>(args?: SelectSubset<T, EditorStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EditorStates and returns the data saved in the database.
     * @param {EditorStateCreateManyAndReturnArgs} args - Arguments to create many EditorStates.
     * @example
     * // Create many EditorStates
     * const editorState = await prisma.editorState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EditorStates and only return the `workspaceId`
     * const editorStateWithWorkspaceIdOnly = await prisma.editorState.createManyAndReturn({
     *   select: { workspaceId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EditorStateCreateManyAndReturnArgs>(args?: SelectSubset<T, EditorStateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EditorStatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EditorState.
     * @param {EditorStateDeleteArgs} args - Arguments to delete one EditorState.
     * @example
     * // Delete one EditorState
     * const EditorState = await prisma.editorState.delete({
     *   where: {
     *     // ... filter to delete one EditorState
     *   }
     * })
     * 
     */
    delete<T extends EditorStateDeleteArgs>(args: SelectSubset<T, EditorStateDeleteArgs<ExtArgs>>): Prisma__EditorStateClient<$Result.GetResult<Prisma.$EditorStatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EditorState.
     * @param {EditorStateUpdateArgs} args - Arguments to update one EditorState.
     * @example
     * // Update one EditorState
     * const editorState = await prisma.editorState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EditorStateUpdateArgs>(args: SelectSubset<T, EditorStateUpdateArgs<ExtArgs>>): Prisma__EditorStateClient<$Result.GetResult<Prisma.$EditorStatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EditorStates.
     * @param {EditorStateDeleteManyArgs} args - Arguments to filter EditorStates to delete.
     * @example
     * // Delete a few EditorStates
     * const { count } = await prisma.editorState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EditorStateDeleteManyArgs>(args?: SelectSubset<T, EditorStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EditorStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EditorStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EditorStates
     * const editorState = await prisma.editorState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EditorStateUpdateManyArgs>(args: SelectSubset<T, EditorStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EditorStates and returns the data updated in the database.
     * @param {EditorStateUpdateManyAndReturnArgs} args - Arguments to update many EditorStates.
     * @example
     * // Update many EditorStates
     * const editorState = await prisma.editorState.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EditorStates and only return the `workspaceId`
     * const editorStateWithWorkspaceIdOnly = await prisma.editorState.updateManyAndReturn({
     *   select: { workspaceId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EditorStateUpdateManyAndReturnArgs>(args: SelectSubset<T, EditorStateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EditorStatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EditorState.
     * @param {EditorStateUpsertArgs} args - Arguments to update or create a EditorState.
     * @example
     * // Update or create a EditorState
     * const editorState = await prisma.editorState.upsert({
     *   create: {
     *     // ... data to create a EditorState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EditorState we want to update
     *   }
     * })
     */
    upsert<T extends EditorStateUpsertArgs>(args: SelectSubset<T, EditorStateUpsertArgs<ExtArgs>>): Prisma__EditorStateClient<$Result.GetResult<Prisma.$EditorStatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EditorStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EditorStateCountArgs} args - Arguments to filter EditorStates to count.
     * @example
     * // Count the number of EditorStates
     * const count = await prisma.editorState.count({
     *   where: {
     *     // ... the filter for the EditorStates we want to count
     *   }
     * })
    **/
    count<T extends EditorStateCountArgs>(
      args?: Subset<T, EditorStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EditorStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EditorState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EditorStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EditorStateAggregateArgs>(args: Subset<T, EditorStateAggregateArgs>): Prisma.PrismaPromise<GetEditorStateAggregateType<T>>

    /**
     * Group by EditorState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EditorStateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EditorStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EditorStateGroupByArgs['orderBy'] }
        : { orderBy?: EditorStateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EditorStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEditorStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EditorState model
   */
  readonly fields: EditorStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EditorState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EditorStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tabs<T extends EditorState$tabsArgs<ExtArgs> = {}>(args?: Subset<T, EditorState$tabsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TabStatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EditorState model
   */
  interface EditorStateFieldRefs {
    readonly workspaceId: FieldRef<"EditorState", 'String'>
    readonly activeTabId: FieldRef<"EditorState", 'String'>
    readonly lastSaved: FieldRef<"EditorState", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EditorState findUnique
   */
  export type EditorStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorState
     */
    select?: EditorStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EditorState
     */
    omit?: EditorStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EditorStateInclude<ExtArgs> | null
    /**
     * Filter, which EditorState to fetch.
     */
    where: EditorStateWhereUniqueInput
  }

  /**
   * EditorState findUniqueOrThrow
   */
  export type EditorStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorState
     */
    select?: EditorStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EditorState
     */
    omit?: EditorStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EditorStateInclude<ExtArgs> | null
    /**
     * Filter, which EditorState to fetch.
     */
    where: EditorStateWhereUniqueInput
  }

  /**
   * EditorState findFirst
   */
  export type EditorStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorState
     */
    select?: EditorStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EditorState
     */
    omit?: EditorStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EditorStateInclude<ExtArgs> | null
    /**
     * Filter, which EditorState to fetch.
     */
    where?: EditorStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EditorStates to fetch.
     */
    orderBy?: EditorStateOrderByWithRelationInput | EditorStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EditorStates.
     */
    cursor?: EditorStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EditorStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EditorStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EditorStates.
     */
    distinct?: EditorStateScalarFieldEnum | EditorStateScalarFieldEnum[]
  }

  /**
   * EditorState findFirstOrThrow
   */
  export type EditorStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorState
     */
    select?: EditorStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EditorState
     */
    omit?: EditorStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EditorStateInclude<ExtArgs> | null
    /**
     * Filter, which EditorState to fetch.
     */
    where?: EditorStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EditorStates to fetch.
     */
    orderBy?: EditorStateOrderByWithRelationInput | EditorStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EditorStates.
     */
    cursor?: EditorStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EditorStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EditorStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EditorStates.
     */
    distinct?: EditorStateScalarFieldEnum | EditorStateScalarFieldEnum[]
  }

  /**
   * EditorState findMany
   */
  export type EditorStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorState
     */
    select?: EditorStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EditorState
     */
    omit?: EditorStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EditorStateInclude<ExtArgs> | null
    /**
     * Filter, which EditorStates to fetch.
     */
    where?: EditorStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EditorStates to fetch.
     */
    orderBy?: EditorStateOrderByWithRelationInput | EditorStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EditorStates.
     */
    cursor?: EditorStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EditorStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EditorStates.
     */
    skip?: number
    distinct?: EditorStateScalarFieldEnum | EditorStateScalarFieldEnum[]
  }

  /**
   * EditorState create
   */
  export type EditorStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorState
     */
    select?: EditorStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EditorState
     */
    omit?: EditorStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EditorStateInclude<ExtArgs> | null
    /**
     * The data needed to create a EditorState.
     */
    data: XOR<EditorStateCreateInput, EditorStateUncheckedCreateInput>
  }

  /**
   * EditorState createMany
   */
  export type EditorStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EditorStates.
     */
    data: EditorStateCreateManyInput | EditorStateCreateManyInput[]
  }

  /**
   * EditorState createManyAndReturn
   */
  export type EditorStateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorState
     */
    select?: EditorStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EditorState
     */
    omit?: EditorStateOmit<ExtArgs> | null
    /**
     * The data used to create many EditorStates.
     */
    data: EditorStateCreateManyInput | EditorStateCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EditorStateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EditorState update
   */
  export type EditorStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorState
     */
    select?: EditorStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EditorState
     */
    omit?: EditorStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EditorStateInclude<ExtArgs> | null
    /**
     * The data needed to update a EditorState.
     */
    data: XOR<EditorStateUpdateInput, EditorStateUncheckedUpdateInput>
    /**
     * Choose, which EditorState to update.
     */
    where: EditorStateWhereUniqueInput
  }

  /**
   * EditorState updateMany
   */
  export type EditorStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EditorStates.
     */
    data: XOR<EditorStateUpdateManyMutationInput, EditorStateUncheckedUpdateManyInput>
    /**
     * Filter which EditorStates to update
     */
    where?: EditorStateWhereInput
    /**
     * Limit how many EditorStates to update.
     */
    limit?: number
  }

  /**
   * EditorState updateManyAndReturn
   */
  export type EditorStateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorState
     */
    select?: EditorStateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EditorState
     */
    omit?: EditorStateOmit<ExtArgs> | null
    /**
     * The data used to update EditorStates.
     */
    data: XOR<EditorStateUpdateManyMutationInput, EditorStateUncheckedUpdateManyInput>
    /**
     * Filter which EditorStates to update
     */
    where?: EditorStateWhereInput
    /**
     * Limit how many EditorStates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EditorStateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EditorState upsert
   */
  export type EditorStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorState
     */
    select?: EditorStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EditorState
     */
    omit?: EditorStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EditorStateInclude<ExtArgs> | null
    /**
     * The filter to search for the EditorState to update in case it exists.
     */
    where: EditorStateWhereUniqueInput
    /**
     * In case the EditorState found by the `where` argument doesn't exist, create a new EditorState with this data.
     */
    create: XOR<EditorStateCreateInput, EditorStateUncheckedCreateInput>
    /**
     * In case the EditorState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EditorStateUpdateInput, EditorStateUncheckedUpdateInput>
  }

  /**
   * EditorState delete
   */
  export type EditorStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorState
     */
    select?: EditorStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EditorState
     */
    omit?: EditorStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EditorStateInclude<ExtArgs> | null
    /**
     * Filter which EditorState to delete.
     */
    where: EditorStateWhereUniqueInput
  }

  /**
   * EditorState deleteMany
   */
  export type EditorStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EditorStates to delete
     */
    where?: EditorStateWhereInput
    /**
     * Limit how many EditorStates to delete.
     */
    limit?: number
  }

  /**
   * EditorState.tabs
   */
  export type EditorState$tabsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TabState
     */
    select?: TabStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TabState
     */
    omit?: TabStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TabStateInclude<ExtArgs> | null
    where?: TabStateWhereInput
    orderBy?: TabStateOrderByWithRelationInput | TabStateOrderByWithRelationInput[]
    cursor?: TabStateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TabStateScalarFieldEnum | TabStateScalarFieldEnum[]
  }

  /**
   * EditorState without action
   */
  export type EditorStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EditorState
     */
    select?: EditorStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EditorState
     */
    omit?: EditorStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EditorStateInclude<ExtArgs> | null
  }


  /**
   * Model TabState
   */

  export type AggregateTabState = {
    _count: TabStateCountAggregateOutputType | null
    _avg: TabStateAvgAggregateOutputType | null
    _sum: TabStateSumAggregateOutputType | null
    _min: TabStateMinAggregateOutputType | null
    _max: TabStateMaxAggregateOutputType | null
  }

  export type TabStateAvgAggregateOutputType = {
    cursorLine: number | null
    cursorColumn: number | null
    scrollTop: number | null
  }

  export type TabStateSumAggregateOutputType = {
    cursorLine: number | null
    cursorColumn: number | null
    scrollTop: number | null
  }

  export type TabStateMinAggregateOutputType = {
    id: string | null
    editorStateId: string | null
    path: string | null
    title: string | null
    isDirty: boolean | null
    isActive: boolean | null
    cursorLine: number | null
    cursorColumn: number | null
    scrollTop: number | null
  }

  export type TabStateMaxAggregateOutputType = {
    id: string | null
    editorStateId: string | null
    path: string | null
    title: string | null
    isDirty: boolean | null
    isActive: boolean | null
    cursorLine: number | null
    cursorColumn: number | null
    scrollTop: number | null
  }

  export type TabStateCountAggregateOutputType = {
    id: number
    editorStateId: number
    path: number
    title: number
    isDirty: number
    isActive: number
    cursorLine: number
    cursorColumn: number
    scrollTop: number
    _all: number
  }


  export type TabStateAvgAggregateInputType = {
    cursorLine?: true
    cursorColumn?: true
    scrollTop?: true
  }

  export type TabStateSumAggregateInputType = {
    cursorLine?: true
    cursorColumn?: true
    scrollTop?: true
  }

  export type TabStateMinAggregateInputType = {
    id?: true
    editorStateId?: true
    path?: true
    title?: true
    isDirty?: true
    isActive?: true
    cursorLine?: true
    cursorColumn?: true
    scrollTop?: true
  }

  export type TabStateMaxAggregateInputType = {
    id?: true
    editorStateId?: true
    path?: true
    title?: true
    isDirty?: true
    isActive?: true
    cursorLine?: true
    cursorColumn?: true
    scrollTop?: true
  }

  export type TabStateCountAggregateInputType = {
    id?: true
    editorStateId?: true
    path?: true
    title?: true
    isDirty?: true
    isActive?: true
    cursorLine?: true
    cursorColumn?: true
    scrollTop?: true
    _all?: true
  }

  export type TabStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TabState to aggregate.
     */
    where?: TabStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TabStates to fetch.
     */
    orderBy?: TabStateOrderByWithRelationInput | TabStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TabStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TabStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TabStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TabStates
    **/
    _count?: true | TabStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TabStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TabStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TabStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TabStateMaxAggregateInputType
  }

  export type GetTabStateAggregateType<T extends TabStateAggregateArgs> = {
        [P in keyof T & keyof AggregateTabState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTabState[P]>
      : GetScalarType<T[P], AggregateTabState[P]>
  }




  export type TabStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TabStateWhereInput
    orderBy?: TabStateOrderByWithAggregationInput | TabStateOrderByWithAggregationInput[]
    by: TabStateScalarFieldEnum[] | TabStateScalarFieldEnum
    having?: TabStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TabStateCountAggregateInputType | true
    _avg?: TabStateAvgAggregateInputType
    _sum?: TabStateSumAggregateInputType
    _min?: TabStateMinAggregateInputType
    _max?: TabStateMaxAggregateInputType
  }

  export type TabStateGroupByOutputType = {
    id: string
    editorStateId: string
    path: string
    title: string
    isDirty: boolean
    isActive: boolean
    cursorLine: number
    cursorColumn: number
    scrollTop: number
    _count: TabStateCountAggregateOutputType | null
    _avg: TabStateAvgAggregateOutputType | null
    _sum: TabStateSumAggregateOutputType | null
    _min: TabStateMinAggregateOutputType | null
    _max: TabStateMaxAggregateOutputType | null
  }

  type GetTabStateGroupByPayload<T extends TabStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TabStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TabStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TabStateGroupByOutputType[P]>
            : GetScalarType<T[P], TabStateGroupByOutputType[P]>
        }
      >
    >


  export type TabStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    editorStateId?: boolean
    path?: boolean
    title?: boolean
    isDirty?: boolean
    isActive?: boolean
    cursorLine?: boolean
    cursorColumn?: boolean
    scrollTop?: boolean
    editorState?: boolean | EditorStateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tabState"]>

  export type TabStateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    editorStateId?: boolean
    path?: boolean
    title?: boolean
    isDirty?: boolean
    isActive?: boolean
    cursorLine?: boolean
    cursorColumn?: boolean
    scrollTop?: boolean
    editorState?: boolean | EditorStateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tabState"]>

  export type TabStateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    editorStateId?: boolean
    path?: boolean
    title?: boolean
    isDirty?: boolean
    isActive?: boolean
    cursorLine?: boolean
    cursorColumn?: boolean
    scrollTop?: boolean
    editorState?: boolean | EditorStateDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tabState"]>

  export type TabStateSelectScalar = {
    id?: boolean
    editorStateId?: boolean
    path?: boolean
    title?: boolean
    isDirty?: boolean
    isActive?: boolean
    cursorLine?: boolean
    cursorColumn?: boolean
    scrollTop?: boolean
  }

  export type TabStateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "editorStateId" | "path" | "title" | "isDirty" | "isActive" | "cursorLine" | "cursorColumn" | "scrollTop", ExtArgs["result"]["tabState"]>
  export type TabStateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    editorState?: boolean | EditorStateDefaultArgs<ExtArgs>
  }
  export type TabStateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    editorState?: boolean | EditorStateDefaultArgs<ExtArgs>
  }
  export type TabStateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    editorState?: boolean | EditorStateDefaultArgs<ExtArgs>
  }

  export type $TabStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TabState"
    objects: {
      editorState: Prisma.$EditorStatePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      editorStateId: string
      path: string
      title: string
      isDirty: boolean
      isActive: boolean
      cursorLine: number
      cursorColumn: number
      scrollTop: number
    }, ExtArgs["result"]["tabState"]>
    composites: {}
  }

  type TabStateGetPayload<S extends boolean | null | undefined | TabStateDefaultArgs> = $Result.GetResult<Prisma.$TabStatePayload, S>

  type TabStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TabStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TabStateCountAggregateInputType | true
    }

  export interface TabStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TabState'], meta: { name: 'TabState' } }
    /**
     * Find zero or one TabState that matches the filter.
     * @param {TabStateFindUniqueArgs} args - Arguments to find a TabState
     * @example
     * // Get one TabState
     * const tabState = await prisma.tabState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TabStateFindUniqueArgs>(args: SelectSubset<T, TabStateFindUniqueArgs<ExtArgs>>): Prisma__TabStateClient<$Result.GetResult<Prisma.$TabStatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TabState that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TabStateFindUniqueOrThrowArgs} args - Arguments to find a TabState
     * @example
     * // Get one TabState
     * const tabState = await prisma.tabState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TabStateFindUniqueOrThrowArgs>(args: SelectSubset<T, TabStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TabStateClient<$Result.GetResult<Prisma.$TabStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TabState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TabStateFindFirstArgs} args - Arguments to find a TabState
     * @example
     * // Get one TabState
     * const tabState = await prisma.tabState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TabStateFindFirstArgs>(args?: SelectSubset<T, TabStateFindFirstArgs<ExtArgs>>): Prisma__TabStateClient<$Result.GetResult<Prisma.$TabStatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TabState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TabStateFindFirstOrThrowArgs} args - Arguments to find a TabState
     * @example
     * // Get one TabState
     * const tabState = await prisma.tabState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TabStateFindFirstOrThrowArgs>(args?: SelectSubset<T, TabStateFindFirstOrThrowArgs<ExtArgs>>): Prisma__TabStateClient<$Result.GetResult<Prisma.$TabStatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TabStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TabStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TabStates
     * const tabStates = await prisma.tabState.findMany()
     * 
     * // Get first 10 TabStates
     * const tabStates = await prisma.tabState.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tabStateWithIdOnly = await prisma.tabState.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TabStateFindManyArgs>(args?: SelectSubset<T, TabStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TabStatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TabState.
     * @param {TabStateCreateArgs} args - Arguments to create a TabState.
     * @example
     * // Create one TabState
     * const TabState = await prisma.tabState.create({
     *   data: {
     *     // ... data to create a TabState
     *   }
     * })
     * 
     */
    create<T extends TabStateCreateArgs>(args: SelectSubset<T, TabStateCreateArgs<ExtArgs>>): Prisma__TabStateClient<$Result.GetResult<Prisma.$TabStatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TabStates.
     * @param {TabStateCreateManyArgs} args - Arguments to create many TabStates.
     * @example
     * // Create many TabStates
     * const tabState = await prisma.tabState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TabStateCreateManyArgs>(args?: SelectSubset<T, TabStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TabStates and returns the data saved in the database.
     * @param {TabStateCreateManyAndReturnArgs} args - Arguments to create many TabStates.
     * @example
     * // Create many TabStates
     * const tabState = await prisma.tabState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TabStates and only return the `id`
     * const tabStateWithIdOnly = await prisma.tabState.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TabStateCreateManyAndReturnArgs>(args?: SelectSubset<T, TabStateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TabStatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TabState.
     * @param {TabStateDeleteArgs} args - Arguments to delete one TabState.
     * @example
     * // Delete one TabState
     * const TabState = await prisma.tabState.delete({
     *   where: {
     *     // ... filter to delete one TabState
     *   }
     * })
     * 
     */
    delete<T extends TabStateDeleteArgs>(args: SelectSubset<T, TabStateDeleteArgs<ExtArgs>>): Prisma__TabStateClient<$Result.GetResult<Prisma.$TabStatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TabState.
     * @param {TabStateUpdateArgs} args - Arguments to update one TabState.
     * @example
     * // Update one TabState
     * const tabState = await prisma.tabState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TabStateUpdateArgs>(args: SelectSubset<T, TabStateUpdateArgs<ExtArgs>>): Prisma__TabStateClient<$Result.GetResult<Prisma.$TabStatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TabStates.
     * @param {TabStateDeleteManyArgs} args - Arguments to filter TabStates to delete.
     * @example
     * // Delete a few TabStates
     * const { count } = await prisma.tabState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TabStateDeleteManyArgs>(args?: SelectSubset<T, TabStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TabStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TabStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TabStates
     * const tabState = await prisma.tabState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TabStateUpdateManyArgs>(args: SelectSubset<T, TabStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TabStates and returns the data updated in the database.
     * @param {TabStateUpdateManyAndReturnArgs} args - Arguments to update many TabStates.
     * @example
     * // Update many TabStates
     * const tabState = await prisma.tabState.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TabStates and only return the `id`
     * const tabStateWithIdOnly = await prisma.tabState.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TabStateUpdateManyAndReturnArgs>(args: SelectSubset<T, TabStateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TabStatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TabState.
     * @param {TabStateUpsertArgs} args - Arguments to update or create a TabState.
     * @example
     * // Update or create a TabState
     * const tabState = await prisma.tabState.upsert({
     *   create: {
     *     // ... data to create a TabState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TabState we want to update
     *   }
     * })
     */
    upsert<T extends TabStateUpsertArgs>(args: SelectSubset<T, TabStateUpsertArgs<ExtArgs>>): Prisma__TabStateClient<$Result.GetResult<Prisma.$TabStatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TabStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TabStateCountArgs} args - Arguments to filter TabStates to count.
     * @example
     * // Count the number of TabStates
     * const count = await prisma.tabState.count({
     *   where: {
     *     // ... the filter for the TabStates we want to count
     *   }
     * })
    **/
    count<T extends TabStateCountArgs>(
      args?: Subset<T, TabStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TabStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TabState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TabStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TabStateAggregateArgs>(args: Subset<T, TabStateAggregateArgs>): Prisma.PrismaPromise<GetTabStateAggregateType<T>>

    /**
     * Group by TabState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TabStateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TabStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TabStateGroupByArgs['orderBy'] }
        : { orderBy?: TabStateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TabStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTabStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TabState model
   */
  readonly fields: TabStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TabState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TabStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    editorState<T extends EditorStateDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EditorStateDefaultArgs<ExtArgs>>): Prisma__EditorStateClient<$Result.GetResult<Prisma.$EditorStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TabState model
   */
  interface TabStateFieldRefs {
    readonly id: FieldRef<"TabState", 'String'>
    readonly editorStateId: FieldRef<"TabState", 'String'>
    readonly path: FieldRef<"TabState", 'String'>
    readonly title: FieldRef<"TabState", 'String'>
    readonly isDirty: FieldRef<"TabState", 'Boolean'>
    readonly isActive: FieldRef<"TabState", 'Boolean'>
    readonly cursorLine: FieldRef<"TabState", 'Int'>
    readonly cursorColumn: FieldRef<"TabState", 'Int'>
    readonly scrollTop: FieldRef<"TabState", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * TabState findUnique
   */
  export type TabStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TabState
     */
    select?: TabStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TabState
     */
    omit?: TabStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TabStateInclude<ExtArgs> | null
    /**
     * Filter, which TabState to fetch.
     */
    where: TabStateWhereUniqueInput
  }

  /**
   * TabState findUniqueOrThrow
   */
  export type TabStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TabState
     */
    select?: TabStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TabState
     */
    omit?: TabStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TabStateInclude<ExtArgs> | null
    /**
     * Filter, which TabState to fetch.
     */
    where: TabStateWhereUniqueInput
  }

  /**
   * TabState findFirst
   */
  export type TabStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TabState
     */
    select?: TabStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TabState
     */
    omit?: TabStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TabStateInclude<ExtArgs> | null
    /**
     * Filter, which TabState to fetch.
     */
    where?: TabStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TabStates to fetch.
     */
    orderBy?: TabStateOrderByWithRelationInput | TabStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TabStates.
     */
    cursor?: TabStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TabStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TabStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TabStates.
     */
    distinct?: TabStateScalarFieldEnum | TabStateScalarFieldEnum[]
  }

  /**
   * TabState findFirstOrThrow
   */
  export type TabStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TabState
     */
    select?: TabStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TabState
     */
    omit?: TabStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TabStateInclude<ExtArgs> | null
    /**
     * Filter, which TabState to fetch.
     */
    where?: TabStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TabStates to fetch.
     */
    orderBy?: TabStateOrderByWithRelationInput | TabStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TabStates.
     */
    cursor?: TabStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TabStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TabStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TabStates.
     */
    distinct?: TabStateScalarFieldEnum | TabStateScalarFieldEnum[]
  }

  /**
   * TabState findMany
   */
  export type TabStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TabState
     */
    select?: TabStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TabState
     */
    omit?: TabStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TabStateInclude<ExtArgs> | null
    /**
     * Filter, which TabStates to fetch.
     */
    where?: TabStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TabStates to fetch.
     */
    orderBy?: TabStateOrderByWithRelationInput | TabStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TabStates.
     */
    cursor?: TabStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TabStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TabStates.
     */
    skip?: number
    distinct?: TabStateScalarFieldEnum | TabStateScalarFieldEnum[]
  }

  /**
   * TabState create
   */
  export type TabStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TabState
     */
    select?: TabStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TabState
     */
    omit?: TabStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TabStateInclude<ExtArgs> | null
    /**
     * The data needed to create a TabState.
     */
    data: XOR<TabStateCreateInput, TabStateUncheckedCreateInput>
  }

  /**
   * TabState createMany
   */
  export type TabStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TabStates.
     */
    data: TabStateCreateManyInput | TabStateCreateManyInput[]
  }

  /**
   * TabState createManyAndReturn
   */
  export type TabStateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TabState
     */
    select?: TabStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TabState
     */
    omit?: TabStateOmit<ExtArgs> | null
    /**
     * The data used to create many TabStates.
     */
    data: TabStateCreateManyInput | TabStateCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TabStateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TabState update
   */
  export type TabStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TabState
     */
    select?: TabStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TabState
     */
    omit?: TabStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TabStateInclude<ExtArgs> | null
    /**
     * The data needed to update a TabState.
     */
    data: XOR<TabStateUpdateInput, TabStateUncheckedUpdateInput>
    /**
     * Choose, which TabState to update.
     */
    where: TabStateWhereUniqueInput
  }

  /**
   * TabState updateMany
   */
  export type TabStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TabStates.
     */
    data: XOR<TabStateUpdateManyMutationInput, TabStateUncheckedUpdateManyInput>
    /**
     * Filter which TabStates to update
     */
    where?: TabStateWhereInput
    /**
     * Limit how many TabStates to update.
     */
    limit?: number
  }

  /**
   * TabState updateManyAndReturn
   */
  export type TabStateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TabState
     */
    select?: TabStateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TabState
     */
    omit?: TabStateOmit<ExtArgs> | null
    /**
     * The data used to update TabStates.
     */
    data: XOR<TabStateUpdateManyMutationInput, TabStateUncheckedUpdateManyInput>
    /**
     * Filter which TabStates to update
     */
    where?: TabStateWhereInput
    /**
     * Limit how many TabStates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TabStateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TabState upsert
   */
  export type TabStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TabState
     */
    select?: TabStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TabState
     */
    omit?: TabStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TabStateInclude<ExtArgs> | null
    /**
     * The filter to search for the TabState to update in case it exists.
     */
    where: TabStateWhereUniqueInput
    /**
     * In case the TabState found by the `where` argument doesn't exist, create a new TabState with this data.
     */
    create: XOR<TabStateCreateInput, TabStateUncheckedCreateInput>
    /**
     * In case the TabState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TabStateUpdateInput, TabStateUncheckedUpdateInput>
  }

  /**
   * TabState delete
   */
  export type TabStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TabState
     */
    select?: TabStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TabState
     */
    omit?: TabStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TabStateInclude<ExtArgs> | null
    /**
     * Filter which TabState to delete.
     */
    where: TabStateWhereUniqueInput
  }

  /**
   * TabState deleteMany
   */
  export type TabStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TabStates to delete
     */
    where?: TabStateWhereInput
    /**
     * Limit how many TabStates to delete.
     */
    limit?: number
  }

  /**
   * TabState without action
   */
  export type TabStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TabState
     */
    select?: TabStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TabState
     */
    omit?: TabStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TabStateInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    username: 'username',
    passwordHash: 'passwordHash',
    role: 'role',
    isActive: 'isActive',
    lastLogin: 'lastLogin',
    bio: 'bio',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ExtensionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    authorId: 'authorId',
    gitUrl: 'gitUrl',
    gitBranch: 'gitBranch',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    active: 'active',
    installedVersionId: 'installedVersionId'
  };

  export type ExtensionScalarFieldEnum = (typeof ExtensionScalarFieldEnum)[keyof typeof ExtensionScalarFieldEnum]


  export const ExtensionVersionScalarFieldEnum: {
    id: 'id',
    extensionId: 'extensionId',
    version: 'version',
    gitUrl: 'gitUrl',
    gitBranch: 'gitBranch',
    status: 'status',
    buildLogs: 'buildLogs',
    entryPointUrl: 'entryPointUrl',
    createdAt: 'createdAt'
  };

  export type ExtensionVersionScalarFieldEnum = (typeof ExtensionVersionScalarFieldEnum)[keyof typeof ExtensionVersionScalarFieldEnum]


  export const UserExtensionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    extensionId: 'extensionId',
    installedVersionId: 'installedVersionId',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserExtensionScalarFieldEnum = (typeof UserExtensionScalarFieldEnum)[keyof typeof UserExtensionScalarFieldEnum]


  export const WorkspaceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    ownerId: 'ownerId',
    isPublic: 'isPublic',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WorkspaceScalarFieldEnum = (typeof WorkspaceScalarFieldEnum)[keyof typeof WorkspaceScalarFieldEnum]


  export const WorkspaceSecretScalarFieldEnum: {
    id: 'id',
    workspaceId: 'workspaceId',
    key: 'key',
    value: 'value',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WorkspaceSecretScalarFieldEnum = (typeof WorkspaceSecretScalarFieldEnum)[keyof typeof WorkspaceSecretScalarFieldEnum]


  export const UserSettingsScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    theme: 'theme',
    fontSize: 'fontSize',
    fontFamily: 'fontFamily',
    lineHeight: 'lineHeight',
    tabSize: 'tabSize',
    useSpaces: 'useSpaces',
    autoFormat: 'autoFormat',
    formatOnSave: 'formatOnSave',
    autoSave: 'autoSave',
    autoSaveDelay: 'autoSaveDelay',
    wordWrap: 'wordWrap',
    minimap: 'minimap',
    lineNumbers: 'lineNumbers'
  };

  export type UserSettingsScalarFieldEnum = (typeof UserSettingsScalarFieldEnum)[keyof typeof UserSettingsScalarFieldEnum]


  export const WorkspaceSettingsScalarFieldEnum: {
    workspaceId: 'workspaceId',
    settings: 'settings'
  };

  export type WorkspaceSettingsScalarFieldEnum = (typeof WorkspaceSettingsScalarFieldEnum)[keyof typeof WorkspaceSettingsScalarFieldEnum]


  export const EditorStateScalarFieldEnum: {
    workspaceId: 'workspaceId',
    activeTabId: 'activeTabId',
    lastSaved: 'lastSaved'
  };

  export type EditorStateScalarFieldEnum = (typeof EditorStateScalarFieldEnum)[keyof typeof EditorStateScalarFieldEnum]


  export const TabStateScalarFieldEnum: {
    id: 'id',
    editorStateId: 'editorStateId',
    path: 'path',
    title: 'title',
    isDirty: 'isDirty',
    isActive: 'isActive',
    cursorLine: 'cursorLine',
    cursorColumn: 'cursorColumn',
    scrollTop: 'scrollTop'
  };

  export type TabStateScalarFieldEnum = (typeof TabStateScalarFieldEnum)[keyof typeof TabStateScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    bio?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    workspaces?: WorkspaceListRelationFilter
    settings?: XOR<UserSettingsNullableScalarRelationFilter, UserSettingsWhereInput> | null
    extensions?: ExtensionListRelationFilter
    userExtensions?: UserExtensionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLogin?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    workspaces?: WorkspaceOrderByRelationAggregateInput
    settings?: UserSettingsOrderByWithRelationInput
    extensions?: ExtensionOrderByRelationAggregateInput
    userExtensions?: UserExtensionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    lastLogin?: DateTimeNullableFilter<"User"> | Date | string | null
    bio?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    workspaces?: WorkspaceListRelationFilter
    settings?: XOR<UserSettingsNullableScalarRelationFilter, UserSettingsWhereInput> | null
    extensions?: ExtensionListRelationFilter
    userExtensions?: UserExtensionListRelationFilter
  }, "id" | "email" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLogin?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    lastLogin?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    bio?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ExtensionWhereInput = {
    AND?: ExtensionWhereInput | ExtensionWhereInput[]
    OR?: ExtensionWhereInput[]
    NOT?: ExtensionWhereInput | ExtensionWhereInput[]
    id?: StringFilter<"Extension"> | string
    name?: StringFilter<"Extension"> | string
    description?: StringNullableFilter<"Extension"> | string | null
    authorId?: StringFilter<"Extension"> | string
    gitUrl?: StringNullableFilter<"Extension"> | string | null
    gitBranch?: StringNullableFilter<"Extension"> | string | null
    createdAt?: DateTimeFilter<"Extension"> | Date | string
    updatedAt?: DateTimeFilter<"Extension"> | Date | string
    active?: BoolFilter<"Extension"> | boolean
    installedVersionId?: StringNullableFilter<"Extension"> | string | null
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    versions?: ExtensionVersionListRelationFilter
    installations?: UserExtensionListRelationFilter
  }

  export type ExtensionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    authorId?: SortOrder
    gitUrl?: SortOrderInput | SortOrder
    gitBranch?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    active?: SortOrder
    installedVersionId?: SortOrderInput | SortOrder
    author?: UserOrderByWithRelationInput
    versions?: ExtensionVersionOrderByRelationAggregateInput
    installations?: UserExtensionOrderByRelationAggregateInput
  }

  export type ExtensionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: ExtensionWhereInput | ExtensionWhereInput[]
    OR?: ExtensionWhereInput[]
    NOT?: ExtensionWhereInput | ExtensionWhereInput[]
    description?: StringNullableFilter<"Extension"> | string | null
    authorId?: StringFilter<"Extension"> | string
    gitUrl?: StringNullableFilter<"Extension"> | string | null
    gitBranch?: StringNullableFilter<"Extension"> | string | null
    createdAt?: DateTimeFilter<"Extension"> | Date | string
    updatedAt?: DateTimeFilter<"Extension"> | Date | string
    active?: BoolFilter<"Extension"> | boolean
    installedVersionId?: StringNullableFilter<"Extension"> | string | null
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    versions?: ExtensionVersionListRelationFilter
    installations?: UserExtensionListRelationFilter
  }, "id" | "name">

  export type ExtensionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    authorId?: SortOrder
    gitUrl?: SortOrderInput | SortOrder
    gitBranch?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    active?: SortOrder
    installedVersionId?: SortOrderInput | SortOrder
    _count?: ExtensionCountOrderByAggregateInput
    _max?: ExtensionMaxOrderByAggregateInput
    _min?: ExtensionMinOrderByAggregateInput
  }

  export type ExtensionScalarWhereWithAggregatesInput = {
    AND?: ExtensionScalarWhereWithAggregatesInput | ExtensionScalarWhereWithAggregatesInput[]
    OR?: ExtensionScalarWhereWithAggregatesInput[]
    NOT?: ExtensionScalarWhereWithAggregatesInput | ExtensionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Extension"> | string
    name?: StringWithAggregatesFilter<"Extension"> | string
    description?: StringNullableWithAggregatesFilter<"Extension"> | string | null
    authorId?: StringWithAggregatesFilter<"Extension"> | string
    gitUrl?: StringNullableWithAggregatesFilter<"Extension"> | string | null
    gitBranch?: StringNullableWithAggregatesFilter<"Extension"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Extension"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Extension"> | Date | string
    active?: BoolWithAggregatesFilter<"Extension"> | boolean
    installedVersionId?: StringNullableWithAggregatesFilter<"Extension"> | string | null
  }

  export type ExtensionVersionWhereInput = {
    AND?: ExtensionVersionWhereInput | ExtensionVersionWhereInput[]
    OR?: ExtensionVersionWhereInput[]
    NOT?: ExtensionVersionWhereInput | ExtensionVersionWhereInput[]
    id?: StringFilter<"ExtensionVersion"> | string
    extensionId?: StringFilter<"ExtensionVersion"> | string
    version?: StringFilter<"ExtensionVersion"> | string
    gitUrl?: StringFilter<"ExtensionVersion"> | string
    gitBranch?: StringFilter<"ExtensionVersion"> | string
    status?: StringFilter<"ExtensionVersion"> | string
    buildLogs?: StringFilter<"ExtensionVersion"> | string
    entryPointUrl?: StringNullableFilter<"ExtensionVersion"> | string | null
    createdAt?: DateTimeFilter<"ExtensionVersion"> | Date | string
    extension?: XOR<ExtensionScalarRelationFilter, ExtensionWhereInput>
    installations?: UserExtensionListRelationFilter
  }

  export type ExtensionVersionOrderByWithRelationInput = {
    id?: SortOrder
    extensionId?: SortOrder
    version?: SortOrder
    gitUrl?: SortOrder
    gitBranch?: SortOrder
    status?: SortOrder
    buildLogs?: SortOrder
    entryPointUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    extension?: ExtensionOrderByWithRelationInput
    installations?: UserExtensionOrderByRelationAggregateInput
  }

  export type ExtensionVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExtensionVersionWhereInput | ExtensionVersionWhereInput[]
    OR?: ExtensionVersionWhereInput[]
    NOT?: ExtensionVersionWhereInput | ExtensionVersionWhereInput[]
    extensionId?: StringFilter<"ExtensionVersion"> | string
    version?: StringFilter<"ExtensionVersion"> | string
    gitUrl?: StringFilter<"ExtensionVersion"> | string
    gitBranch?: StringFilter<"ExtensionVersion"> | string
    status?: StringFilter<"ExtensionVersion"> | string
    buildLogs?: StringFilter<"ExtensionVersion"> | string
    entryPointUrl?: StringNullableFilter<"ExtensionVersion"> | string | null
    createdAt?: DateTimeFilter<"ExtensionVersion"> | Date | string
    extension?: XOR<ExtensionScalarRelationFilter, ExtensionWhereInput>
    installations?: UserExtensionListRelationFilter
  }, "id">

  export type ExtensionVersionOrderByWithAggregationInput = {
    id?: SortOrder
    extensionId?: SortOrder
    version?: SortOrder
    gitUrl?: SortOrder
    gitBranch?: SortOrder
    status?: SortOrder
    buildLogs?: SortOrder
    entryPointUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ExtensionVersionCountOrderByAggregateInput
    _max?: ExtensionVersionMaxOrderByAggregateInput
    _min?: ExtensionVersionMinOrderByAggregateInput
  }

  export type ExtensionVersionScalarWhereWithAggregatesInput = {
    AND?: ExtensionVersionScalarWhereWithAggregatesInput | ExtensionVersionScalarWhereWithAggregatesInput[]
    OR?: ExtensionVersionScalarWhereWithAggregatesInput[]
    NOT?: ExtensionVersionScalarWhereWithAggregatesInput | ExtensionVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ExtensionVersion"> | string
    extensionId?: StringWithAggregatesFilter<"ExtensionVersion"> | string
    version?: StringWithAggregatesFilter<"ExtensionVersion"> | string
    gitUrl?: StringWithAggregatesFilter<"ExtensionVersion"> | string
    gitBranch?: StringWithAggregatesFilter<"ExtensionVersion"> | string
    status?: StringWithAggregatesFilter<"ExtensionVersion"> | string
    buildLogs?: StringWithAggregatesFilter<"ExtensionVersion"> | string
    entryPointUrl?: StringNullableWithAggregatesFilter<"ExtensionVersion"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ExtensionVersion"> | Date | string
  }

  export type UserExtensionWhereInput = {
    AND?: UserExtensionWhereInput | UserExtensionWhereInput[]
    OR?: UserExtensionWhereInput[]
    NOT?: UserExtensionWhereInput | UserExtensionWhereInput[]
    id?: StringFilter<"UserExtension"> | string
    userId?: StringFilter<"UserExtension"> | string
    extensionId?: StringFilter<"UserExtension"> | string
    installedVersionId?: StringFilter<"UserExtension"> | string
    active?: BoolFilter<"UserExtension"> | boolean
    createdAt?: DateTimeFilter<"UserExtension"> | Date | string
    updatedAt?: DateTimeFilter<"UserExtension"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    extension?: XOR<ExtensionScalarRelationFilter, ExtensionWhereInput>
    installedVersion?: XOR<ExtensionVersionScalarRelationFilter, ExtensionVersionWhereInput>
  }

  export type UserExtensionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    extensionId?: SortOrder
    installedVersionId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    extension?: ExtensionOrderByWithRelationInput
    installedVersion?: ExtensionVersionOrderByWithRelationInput
  }

  export type UserExtensionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_extensionId?: UserExtensionUserIdExtensionIdCompoundUniqueInput
    AND?: UserExtensionWhereInput | UserExtensionWhereInput[]
    OR?: UserExtensionWhereInput[]
    NOT?: UserExtensionWhereInput | UserExtensionWhereInput[]
    userId?: StringFilter<"UserExtension"> | string
    extensionId?: StringFilter<"UserExtension"> | string
    installedVersionId?: StringFilter<"UserExtension"> | string
    active?: BoolFilter<"UserExtension"> | boolean
    createdAt?: DateTimeFilter<"UserExtension"> | Date | string
    updatedAt?: DateTimeFilter<"UserExtension"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    extension?: XOR<ExtensionScalarRelationFilter, ExtensionWhereInput>
    installedVersion?: XOR<ExtensionVersionScalarRelationFilter, ExtensionVersionWhereInput>
  }, "id" | "userId_extensionId">

  export type UserExtensionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    extensionId?: SortOrder
    installedVersionId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserExtensionCountOrderByAggregateInput
    _max?: UserExtensionMaxOrderByAggregateInput
    _min?: UserExtensionMinOrderByAggregateInput
  }

  export type UserExtensionScalarWhereWithAggregatesInput = {
    AND?: UserExtensionScalarWhereWithAggregatesInput | UserExtensionScalarWhereWithAggregatesInput[]
    OR?: UserExtensionScalarWhereWithAggregatesInput[]
    NOT?: UserExtensionScalarWhereWithAggregatesInput | UserExtensionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserExtension"> | string
    userId?: StringWithAggregatesFilter<"UserExtension"> | string
    extensionId?: StringWithAggregatesFilter<"UserExtension"> | string
    installedVersionId?: StringWithAggregatesFilter<"UserExtension"> | string
    active?: BoolWithAggregatesFilter<"UserExtension"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"UserExtension"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserExtension"> | Date | string
  }

  export type WorkspaceWhereInput = {
    AND?: WorkspaceWhereInput | WorkspaceWhereInput[]
    OR?: WorkspaceWhereInput[]
    NOT?: WorkspaceWhereInput | WorkspaceWhereInput[]
    id?: StringFilter<"Workspace"> | string
    name?: StringFilter<"Workspace"> | string
    description?: StringNullableFilter<"Workspace"> | string | null
    ownerId?: StringFilter<"Workspace"> | string
    isPublic?: BoolFilter<"Workspace"> | boolean
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
    updatedAt?: DateTimeFilter<"Workspace"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    settings?: XOR<WorkspaceSettingsNullableScalarRelationFilter, WorkspaceSettingsWhereInput> | null
    editorState?: XOR<EditorStateNullableScalarRelationFilter, EditorStateWhereInput> | null
    secrets?: WorkspaceSecretListRelationFilter
  }

  export type WorkspaceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    ownerId?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    settings?: WorkspaceSettingsOrderByWithRelationInput
    editorState?: EditorStateOrderByWithRelationInput
    secrets?: WorkspaceSecretOrderByRelationAggregateInput
  }

  export type WorkspaceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkspaceWhereInput | WorkspaceWhereInput[]
    OR?: WorkspaceWhereInput[]
    NOT?: WorkspaceWhereInput | WorkspaceWhereInput[]
    name?: StringFilter<"Workspace"> | string
    description?: StringNullableFilter<"Workspace"> | string | null
    ownerId?: StringFilter<"Workspace"> | string
    isPublic?: BoolFilter<"Workspace"> | boolean
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
    updatedAt?: DateTimeFilter<"Workspace"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    settings?: XOR<WorkspaceSettingsNullableScalarRelationFilter, WorkspaceSettingsWhereInput> | null
    editorState?: XOR<EditorStateNullableScalarRelationFilter, EditorStateWhereInput> | null
    secrets?: WorkspaceSecretListRelationFilter
  }, "id">

  export type WorkspaceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    ownerId?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WorkspaceCountOrderByAggregateInput
    _max?: WorkspaceMaxOrderByAggregateInput
    _min?: WorkspaceMinOrderByAggregateInput
  }

  export type WorkspaceScalarWhereWithAggregatesInput = {
    AND?: WorkspaceScalarWhereWithAggregatesInput | WorkspaceScalarWhereWithAggregatesInput[]
    OR?: WorkspaceScalarWhereWithAggregatesInput[]
    NOT?: WorkspaceScalarWhereWithAggregatesInput | WorkspaceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Workspace"> | string
    name?: StringWithAggregatesFilter<"Workspace"> | string
    description?: StringNullableWithAggregatesFilter<"Workspace"> | string | null
    ownerId?: StringWithAggregatesFilter<"Workspace"> | string
    isPublic?: BoolWithAggregatesFilter<"Workspace"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Workspace"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Workspace"> | Date | string
  }

  export type WorkspaceSecretWhereInput = {
    AND?: WorkspaceSecretWhereInput | WorkspaceSecretWhereInput[]
    OR?: WorkspaceSecretWhereInput[]
    NOT?: WorkspaceSecretWhereInput | WorkspaceSecretWhereInput[]
    id?: StringFilter<"WorkspaceSecret"> | string
    workspaceId?: StringFilter<"WorkspaceSecret"> | string
    key?: StringFilter<"WorkspaceSecret"> | string
    value?: StringFilter<"WorkspaceSecret"> | string
    createdAt?: DateTimeFilter<"WorkspaceSecret"> | Date | string
    updatedAt?: DateTimeFilter<"WorkspaceSecret"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
  }

  export type WorkspaceSecretOrderByWithRelationInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    workspace?: WorkspaceOrderByWithRelationInput
  }

  export type WorkspaceSecretWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    workspaceId_key?: WorkspaceSecretWorkspaceIdKeyCompoundUniqueInput
    AND?: WorkspaceSecretWhereInput | WorkspaceSecretWhereInput[]
    OR?: WorkspaceSecretWhereInput[]
    NOT?: WorkspaceSecretWhereInput | WorkspaceSecretWhereInput[]
    workspaceId?: StringFilter<"WorkspaceSecret"> | string
    key?: StringFilter<"WorkspaceSecret"> | string
    value?: StringFilter<"WorkspaceSecret"> | string
    createdAt?: DateTimeFilter<"WorkspaceSecret"> | Date | string
    updatedAt?: DateTimeFilter<"WorkspaceSecret"> | Date | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
  }, "id" | "workspaceId_key">

  export type WorkspaceSecretOrderByWithAggregationInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WorkspaceSecretCountOrderByAggregateInput
    _max?: WorkspaceSecretMaxOrderByAggregateInput
    _min?: WorkspaceSecretMinOrderByAggregateInput
  }

  export type WorkspaceSecretScalarWhereWithAggregatesInput = {
    AND?: WorkspaceSecretScalarWhereWithAggregatesInput | WorkspaceSecretScalarWhereWithAggregatesInput[]
    OR?: WorkspaceSecretScalarWhereWithAggregatesInput[]
    NOT?: WorkspaceSecretScalarWhereWithAggregatesInput | WorkspaceSecretScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkspaceSecret"> | string
    workspaceId?: StringWithAggregatesFilter<"WorkspaceSecret"> | string
    key?: StringWithAggregatesFilter<"WorkspaceSecret"> | string
    value?: StringWithAggregatesFilter<"WorkspaceSecret"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WorkspaceSecret"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WorkspaceSecret"> | Date | string
  }

  export type UserSettingsWhereInput = {
    AND?: UserSettingsWhereInput | UserSettingsWhereInput[]
    OR?: UserSettingsWhereInput[]
    NOT?: UserSettingsWhereInput | UserSettingsWhereInput[]
    id?: StringFilter<"UserSettings"> | string
    userId?: StringFilter<"UserSettings"> | string
    theme?: StringFilter<"UserSettings"> | string
    fontSize?: IntFilter<"UserSettings"> | number
    fontFamily?: StringFilter<"UserSettings"> | string
    lineHeight?: FloatFilter<"UserSettings"> | number
    tabSize?: IntFilter<"UserSettings"> | number
    useSpaces?: BoolFilter<"UserSettings"> | boolean
    autoFormat?: BoolFilter<"UserSettings"> | boolean
    formatOnSave?: BoolFilter<"UserSettings"> | boolean
    autoSave?: BoolFilter<"UserSettings"> | boolean
    autoSaveDelay?: IntFilter<"UserSettings"> | number
    wordWrap?: BoolFilter<"UserSettings"> | boolean
    minimap?: BoolFilter<"UserSettings"> | boolean
    lineNumbers?: BoolFilter<"UserSettings"> | boolean
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserSettingsOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    fontSize?: SortOrder
    fontFamily?: SortOrder
    lineHeight?: SortOrder
    tabSize?: SortOrder
    useSpaces?: SortOrder
    autoFormat?: SortOrder
    formatOnSave?: SortOrder
    autoSave?: SortOrder
    autoSaveDelay?: SortOrder
    wordWrap?: SortOrder
    minimap?: SortOrder
    lineNumbers?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserSettingsWhereInput | UserSettingsWhereInput[]
    OR?: UserSettingsWhereInput[]
    NOT?: UserSettingsWhereInput | UserSettingsWhereInput[]
    theme?: StringFilter<"UserSettings"> | string
    fontSize?: IntFilter<"UserSettings"> | number
    fontFamily?: StringFilter<"UserSettings"> | string
    lineHeight?: FloatFilter<"UserSettings"> | number
    tabSize?: IntFilter<"UserSettings"> | number
    useSpaces?: BoolFilter<"UserSettings"> | boolean
    autoFormat?: BoolFilter<"UserSettings"> | boolean
    formatOnSave?: BoolFilter<"UserSettings"> | boolean
    autoSave?: BoolFilter<"UserSettings"> | boolean
    autoSaveDelay?: IntFilter<"UserSettings"> | number
    wordWrap?: BoolFilter<"UserSettings"> | boolean
    minimap?: BoolFilter<"UserSettings"> | boolean
    lineNumbers?: BoolFilter<"UserSettings"> | boolean
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type UserSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    fontSize?: SortOrder
    fontFamily?: SortOrder
    lineHeight?: SortOrder
    tabSize?: SortOrder
    useSpaces?: SortOrder
    autoFormat?: SortOrder
    formatOnSave?: SortOrder
    autoSave?: SortOrder
    autoSaveDelay?: SortOrder
    wordWrap?: SortOrder
    minimap?: SortOrder
    lineNumbers?: SortOrder
    _count?: UserSettingsCountOrderByAggregateInput
    _avg?: UserSettingsAvgOrderByAggregateInput
    _max?: UserSettingsMaxOrderByAggregateInput
    _min?: UserSettingsMinOrderByAggregateInput
    _sum?: UserSettingsSumOrderByAggregateInput
  }

  export type UserSettingsScalarWhereWithAggregatesInput = {
    AND?: UserSettingsScalarWhereWithAggregatesInput | UserSettingsScalarWhereWithAggregatesInput[]
    OR?: UserSettingsScalarWhereWithAggregatesInput[]
    NOT?: UserSettingsScalarWhereWithAggregatesInput | UserSettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserSettings"> | string
    userId?: StringWithAggregatesFilter<"UserSettings"> | string
    theme?: StringWithAggregatesFilter<"UserSettings"> | string
    fontSize?: IntWithAggregatesFilter<"UserSettings"> | number
    fontFamily?: StringWithAggregatesFilter<"UserSettings"> | string
    lineHeight?: FloatWithAggregatesFilter<"UserSettings"> | number
    tabSize?: IntWithAggregatesFilter<"UserSettings"> | number
    useSpaces?: BoolWithAggregatesFilter<"UserSettings"> | boolean
    autoFormat?: BoolWithAggregatesFilter<"UserSettings"> | boolean
    formatOnSave?: BoolWithAggregatesFilter<"UserSettings"> | boolean
    autoSave?: BoolWithAggregatesFilter<"UserSettings"> | boolean
    autoSaveDelay?: IntWithAggregatesFilter<"UserSettings"> | number
    wordWrap?: BoolWithAggregatesFilter<"UserSettings"> | boolean
    minimap?: BoolWithAggregatesFilter<"UserSettings"> | boolean
    lineNumbers?: BoolWithAggregatesFilter<"UserSettings"> | boolean
  }

  export type WorkspaceSettingsWhereInput = {
    AND?: WorkspaceSettingsWhereInput | WorkspaceSettingsWhereInput[]
    OR?: WorkspaceSettingsWhereInput[]
    NOT?: WorkspaceSettingsWhereInput | WorkspaceSettingsWhereInput[]
    workspaceId?: StringFilter<"WorkspaceSettings"> | string
    settings?: StringFilter<"WorkspaceSettings"> | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
  }

  export type WorkspaceSettingsOrderByWithRelationInput = {
    workspaceId?: SortOrder
    settings?: SortOrder
    workspace?: WorkspaceOrderByWithRelationInput
  }

  export type WorkspaceSettingsWhereUniqueInput = Prisma.AtLeast<{
    workspaceId?: string
    AND?: WorkspaceSettingsWhereInput | WorkspaceSettingsWhereInput[]
    OR?: WorkspaceSettingsWhereInput[]
    NOT?: WorkspaceSettingsWhereInput | WorkspaceSettingsWhereInput[]
    settings?: StringFilter<"WorkspaceSettings"> | string
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
  }, "workspaceId">

  export type WorkspaceSettingsOrderByWithAggregationInput = {
    workspaceId?: SortOrder
    settings?: SortOrder
    _count?: WorkspaceSettingsCountOrderByAggregateInput
    _max?: WorkspaceSettingsMaxOrderByAggregateInput
    _min?: WorkspaceSettingsMinOrderByAggregateInput
  }

  export type WorkspaceSettingsScalarWhereWithAggregatesInput = {
    AND?: WorkspaceSettingsScalarWhereWithAggregatesInput | WorkspaceSettingsScalarWhereWithAggregatesInput[]
    OR?: WorkspaceSettingsScalarWhereWithAggregatesInput[]
    NOT?: WorkspaceSettingsScalarWhereWithAggregatesInput | WorkspaceSettingsScalarWhereWithAggregatesInput[]
    workspaceId?: StringWithAggregatesFilter<"WorkspaceSettings"> | string
    settings?: StringWithAggregatesFilter<"WorkspaceSettings"> | string
  }

  export type EditorStateWhereInput = {
    AND?: EditorStateWhereInput | EditorStateWhereInput[]
    OR?: EditorStateWhereInput[]
    NOT?: EditorStateWhereInput | EditorStateWhereInput[]
    workspaceId?: StringFilter<"EditorState"> | string
    activeTabId?: StringNullableFilter<"EditorState"> | string | null
    lastSaved?: DateTimeNullableFilter<"EditorState"> | Date | string | null
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    tabs?: TabStateListRelationFilter
  }

  export type EditorStateOrderByWithRelationInput = {
    workspaceId?: SortOrder
    activeTabId?: SortOrderInput | SortOrder
    lastSaved?: SortOrderInput | SortOrder
    workspace?: WorkspaceOrderByWithRelationInput
    tabs?: TabStateOrderByRelationAggregateInput
  }

  export type EditorStateWhereUniqueInput = Prisma.AtLeast<{
    workspaceId?: string
    AND?: EditorStateWhereInput | EditorStateWhereInput[]
    OR?: EditorStateWhereInput[]
    NOT?: EditorStateWhereInput | EditorStateWhereInput[]
    activeTabId?: StringNullableFilter<"EditorState"> | string | null
    lastSaved?: DateTimeNullableFilter<"EditorState"> | Date | string | null
    workspace?: XOR<WorkspaceScalarRelationFilter, WorkspaceWhereInput>
    tabs?: TabStateListRelationFilter
  }, "workspaceId">

  export type EditorStateOrderByWithAggregationInput = {
    workspaceId?: SortOrder
    activeTabId?: SortOrderInput | SortOrder
    lastSaved?: SortOrderInput | SortOrder
    _count?: EditorStateCountOrderByAggregateInput
    _max?: EditorStateMaxOrderByAggregateInput
    _min?: EditorStateMinOrderByAggregateInput
  }

  export type EditorStateScalarWhereWithAggregatesInput = {
    AND?: EditorStateScalarWhereWithAggregatesInput | EditorStateScalarWhereWithAggregatesInput[]
    OR?: EditorStateScalarWhereWithAggregatesInput[]
    NOT?: EditorStateScalarWhereWithAggregatesInput | EditorStateScalarWhereWithAggregatesInput[]
    workspaceId?: StringWithAggregatesFilter<"EditorState"> | string
    activeTabId?: StringNullableWithAggregatesFilter<"EditorState"> | string | null
    lastSaved?: DateTimeNullableWithAggregatesFilter<"EditorState"> | Date | string | null
  }

  export type TabStateWhereInput = {
    AND?: TabStateWhereInput | TabStateWhereInput[]
    OR?: TabStateWhereInput[]
    NOT?: TabStateWhereInput | TabStateWhereInput[]
    id?: StringFilter<"TabState"> | string
    editorStateId?: StringFilter<"TabState"> | string
    path?: StringFilter<"TabState"> | string
    title?: StringFilter<"TabState"> | string
    isDirty?: BoolFilter<"TabState"> | boolean
    isActive?: BoolFilter<"TabState"> | boolean
    cursorLine?: IntFilter<"TabState"> | number
    cursorColumn?: IntFilter<"TabState"> | number
    scrollTop?: IntFilter<"TabState"> | number
    editorState?: XOR<EditorStateScalarRelationFilter, EditorStateWhereInput>
  }

  export type TabStateOrderByWithRelationInput = {
    id?: SortOrder
    editorStateId?: SortOrder
    path?: SortOrder
    title?: SortOrder
    isDirty?: SortOrder
    isActive?: SortOrder
    cursorLine?: SortOrder
    cursorColumn?: SortOrder
    scrollTop?: SortOrder
    editorState?: EditorStateOrderByWithRelationInput
  }

  export type TabStateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TabStateWhereInput | TabStateWhereInput[]
    OR?: TabStateWhereInput[]
    NOT?: TabStateWhereInput | TabStateWhereInput[]
    editorStateId?: StringFilter<"TabState"> | string
    path?: StringFilter<"TabState"> | string
    title?: StringFilter<"TabState"> | string
    isDirty?: BoolFilter<"TabState"> | boolean
    isActive?: BoolFilter<"TabState"> | boolean
    cursorLine?: IntFilter<"TabState"> | number
    cursorColumn?: IntFilter<"TabState"> | number
    scrollTop?: IntFilter<"TabState"> | number
    editorState?: XOR<EditorStateScalarRelationFilter, EditorStateWhereInput>
  }, "id">

  export type TabStateOrderByWithAggregationInput = {
    id?: SortOrder
    editorStateId?: SortOrder
    path?: SortOrder
    title?: SortOrder
    isDirty?: SortOrder
    isActive?: SortOrder
    cursorLine?: SortOrder
    cursorColumn?: SortOrder
    scrollTop?: SortOrder
    _count?: TabStateCountOrderByAggregateInput
    _avg?: TabStateAvgOrderByAggregateInput
    _max?: TabStateMaxOrderByAggregateInput
    _min?: TabStateMinOrderByAggregateInput
    _sum?: TabStateSumOrderByAggregateInput
  }

  export type TabStateScalarWhereWithAggregatesInput = {
    AND?: TabStateScalarWhereWithAggregatesInput | TabStateScalarWhereWithAggregatesInput[]
    OR?: TabStateScalarWhereWithAggregatesInput[]
    NOT?: TabStateScalarWhereWithAggregatesInput | TabStateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TabState"> | string
    editorStateId?: StringWithAggregatesFilter<"TabState"> | string
    path?: StringWithAggregatesFilter<"TabState"> | string
    title?: StringWithAggregatesFilter<"TabState"> | string
    isDirty?: BoolWithAggregatesFilter<"TabState"> | boolean
    isActive?: BoolWithAggregatesFilter<"TabState"> | boolean
    cursorLine?: IntWithAggregatesFilter<"TabState"> | number
    cursorColumn?: IntWithAggregatesFilter<"TabState"> | number
    scrollTop?: IntWithAggregatesFilter<"TabState"> | number
  }

  export type UserCreateInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLogin?: Date | string | null
    bio?: string | null
    createdAt?: Date | string
    workspaces?: WorkspaceCreateNestedManyWithoutOwnerInput
    settings?: UserSettingsCreateNestedOneWithoutUserInput
    extensions?: ExtensionCreateNestedManyWithoutAuthorInput
    userExtensions?: UserExtensionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLogin?: Date | string | null
    bio?: string | null
    createdAt?: Date | string
    workspaces?: WorkspaceUncheckedCreateNestedManyWithoutOwnerInput
    settings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
    extensions?: ExtensionUncheckedCreateNestedManyWithoutAuthorInput
    userExtensions?: UserExtensionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspaces?: WorkspaceUpdateManyWithoutOwnerNestedInput
    settings?: UserSettingsUpdateOneWithoutUserNestedInput
    extensions?: ExtensionUpdateManyWithoutAuthorNestedInput
    userExtensions?: UserExtensionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspaces?: WorkspaceUncheckedUpdateManyWithoutOwnerNestedInput
    settings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
    extensions?: ExtensionUncheckedUpdateManyWithoutAuthorNestedInput
    userExtensions?: UserExtensionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLogin?: Date | string | null
    bio?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtensionCreateInput = {
    id?: string
    name: string
    description?: string | null
    gitUrl?: string | null
    gitBranch?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    active?: boolean
    installedVersionId?: string | null
    author: UserCreateNestedOneWithoutExtensionsInput
    versions?: ExtensionVersionCreateNestedManyWithoutExtensionInput
    installations?: UserExtensionCreateNestedManyWithoutExtensionInput
  }

  export type ExtensionUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    authorId: string
    gitUrl?: string | null
    gitBranch?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    active?: boolean
    installedVersionId?: string | null
    versions?: ExtensionVersionUncheckedCreateNestedManyWithoutExtensionInput
    installations?: UserExtensionUncheckedCreateNestedManyWithoutExtensionInput
  }

  export type ExtensionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    gitUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gitBranch?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    installedVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    author?: UserUpdateOneRequiredWithoutExtensionsNestedInput
    versions?: ExtensionVersionUpdateManyWithoutExtensionNestedInput
    installations?: UserExtensionUpdateManyWithoutExtensionNestedInput
  }

  export type ExtensionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    gitUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gitBranch?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    installedVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    versions?: ExtensionVersionUncheckedUpdateManyWithoutExtensionNestedInput
    installations?: UserExtensionUncheckedUpdateManyWithoutExtensionNestedInput
  }

  export type ExtensionCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    authorId: string
    gitUrl?: string | null
    gitBranch?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    active?: boolean
    installedVersionId?: string | null
  }

  export type ExtensionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    gitUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gitBranch?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    installedVersionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ExtensionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    gitUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gitBranch?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    installedVersionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ExtensionVersionCreateInput = {
    id?: string
    version: string
    gitUrl: string
    gitBranch?: string
    status?: string
    buildLogs?: string
    entryPointUrl?: string | null
    createdAt?: Date | string
    extension: ExtensionCreateNestedOneWithoutVersionsInput
    installations?: UserExtensionCreateNestedManyWithoutInstalledVersionInput
  }

  export type ExtensionVersionUncheckedCreateInput = {
    id?: string
    extensionId: string
    version: string
    gitUrl: string
    gitBranch?: string
    status?: string
    buildLogs?: string
    entryPointUrl?: string | null
    createdAt?: Date | string
    installations?: UserExtensionUncheckedCreateNestedManyWithoutInstalledVersionInput
  }

  export type ExtensionVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    gitUrl?: StringFieldUpdateOperationsInput | string
    gitBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    buildLogs?: StringFieldUpdateOperationsInput | string
    entryPointUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    extension?: ExtensionUpdateOneRequiredWithoutVersionsNestedInput
    installations?: UserExtensionUpdateManyWithoutInstalledVersionNestedInput
  }

  export type ExtensionVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    extensionId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    gitUrl?: StringFieldUpdateOperationsInput | string
    gitBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    buildLogs?: StringFieldUpdateOperationsInput | string
    entryPointUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    installations?: UserExtensionUncheckedUpdateManyWithoutInstalledVersionNestedInput
  }

  export type ExtensionVersionCreateManyInput = {
    id?: string
    extensionId: string
    version: string
    gitUrl: string
    gitBranch?: string
    status?: string
    buildLogs?: string
    entryPointUrl?: string | null
    createdAt?: Date | string
  }

  export type ExtensionVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    gitUrl?: StringFieldUpdateOperationsInput | string
    gitBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    buildLogs?: StringFieldUpdateOperationsInput | string
    entryPointUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtensionVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    extensionId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    gitUrl?: StringFieldUpdateOperationsInput | string
    gitBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    buildLogs?: StringFieldUpdateOperationsInput | string
    entryPointUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserExtensionCreateInput = {
    id?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUserExtensionsInput
    extension: ExtensionCreateNestedOneWithoutInstallationsInput
    installedVersion: ExtensionVersionCreateNestedOneWithoutInstallationsInput
  }

  export type UserExtensionUncheckedCreateInput = {
    id?: string
    userId: string
    extensionId: string
    installedVersionId: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserExtensionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserExtensionsNestedInput
    extension?: ExtensionUpdateOneRequiredWithoutInstallationsNestedInput
    installedVersion?: ExtensionVersionUpdateOneRequiredWithoutInstallationsNestedInput
  }

  export type UserExtensionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    extensionId?: StringFieldUpdateOperationsInput | string
    installedVersionId?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserExtensionCreateManyInput = {
    id?: string
    userId: string
    extensionId: string
    installedVersionId: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserExtensionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserExtensionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    extensionId?: StringFieldUpdateOperationsInput | string
    installedVersionId?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceCreateInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutWorkspacesInput
    settings?: WorkspaceSettingsCreateNestedOneWithoutWorkspaceInput
    editorState?: EditorStateCreateNestedOneWithoutWorkspaceInput
    secrets?: WorkspaceSecretCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    ownerId: string
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: WorkspaceSettingsUncheckedCreateNestedOneWithoutWorkspaceInput
    editorState?: EditorStateUncheckedCreateNestedOneWithoutWorkspaceInput
    secrets?: WorkspaceSecretUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutWorkspacesNestedInput
    settings?: WorkspaceSettingsUpdateOneWithoutWorkspaceNestedInput
    editorState?: EditorStateUpdateOneWithoutWorkspaceNestedInput
    secrets?: WorkspaceSecretUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: WorkspaceSettingsUncheckedUpdateOneWithoutWorkspaceNestedInput
    editorState?: EditorStateUncheckedUpdateOneWithoutWorkspaceNestedInput
    secrets?: WorkspaceSecretUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    ownerId: string
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceSecretCreateInput = {
    id?: string
    key: string
    value: string
    createdAt?: Date | string
    updatedAt?: Date | string
    workspace: WorkspaceCreateNestedOneWithoutSecretsInput
  }

  export type WorkspaceSecretUncheckedCreateInput = {
    id?: string
    workspaceId: string
    key: string
    value: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceSecretUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspace?: WorkspaceUpdateOneRequiredWithoutSecretsNestedInput
  }

  export type WorkspaceSecretUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceSecretCreateManyInput = {
    id?: string
    workspaceId: string
    key: string
    value: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceSecretUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceSecretUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSettingsCreateInput = {
    id?: string
    theme?: string
    fontSize?: number
    fontFamily?: string
    lineHeight?: number
    tabSize?: number
    useSpaces?: boolean
    autoFormat?: boolean
    formatOnSave?: boolean
    autoSave?: boolean
    autoSaveDelay?: number
    wordWrap?: boolean
    minimap?: boolean
    lineNumbers?: boolean
    user: UserCreateNestedOneWithoutSettingsInput
  }

  export type UserSettingsUncheckedCreateInput = {
    id?: string
    userId: string
    theme?: string
    fontSize?: number
    fontFamily?: string
    lineHeight?: number
    tabSize?: number
    useSpaces?: boolean
    autoFormat?: boolean
    formatOnSave?: boolean
    autoSave?: boolean
    autoSaveDelay?: number
    wordWrap?: boolean
    minimap?: boolean
    lineNumbers?: boolean
  }

  export type UserSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    fontSize?: IntFieldUpdateOperationsInput | number
    fontFamily?: StringFieldUpdateOperationsInput | string
    lineHeight?: FloatFieldUpdateOperationsInput | number
    tabSize?: IntFieldUpdateOperationsInput | number
    useSpaces?: BoolFieldUpdateOperationsInput | boolean
    autoFormat?: BoolFieldUpdateOperationsInput | boolean
    formatOnSave?: BoolFieldUpdateOperationsInput | boolean
    autoSave?: BoolFieldUpdateOperationsInput | boolean
    autoSaveDelay?: IntFieldUpdateOperationsInput | number
    wordWrap?: BoolFieldUpdateOperationsInput | boolean
    minimap?: BoolFieldUpdateOperationsInput | boolean
    lineNumbers?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutSettingsNestedInput
  }

  export type UserSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    fontSize?: IntFieldUpdateOperationsInput | number
    fontFamily?: StringFieldUpdateOperationsInput | string
    lineHeight?: FloatFieldUpdateOperationsInput | number
    tabSize?: IntFieldUpdateOperationsInput | number
    useSpaces?: BoolFieldUpdateOperationsInput | boolean
    autoFormat?: BoolFieldUpdateOperationsInput | boolean
    formatOnSave?: BoolFieldUpdateOperationsInput | boolean
    autoSave?: BoolFieldUpdateOperationsInput | boolean
    autoSaveDelay?: IntFieldUpdateOperationsInput | number
    wordWrap?: BoolFieldUpdateOperationsInput | boolean
    minimap?: BoolFieldUpdateOperationsInput | boolean
    lineNumbers?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserSettingsCreateManyInput = {
    id?: string
    userId: string
    theme?: string
    fontSize?: number
    fontFamily?: string
    lineHeight?: number
    tabSize?: number
    useSpaces?: boolean
    autoFormat?: boolean
    formatOnSave?: boolean
    autoSave?: boolean
    autoSaveDelay?: number
    wordWrap?: boolean
    minimap?: boolean
    lineNumbers?: boolean
  }

  export type UserSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    fontSize?: IntFieldUpdateOperationsInput | number
    fontFamily?: StringFieldUpdateOperationsInput | string
    lineHeight?: FloatFieldUpdateOperationsInput | number
    tabSize?: IntFieldUpdateOperationsInput | number
    useSpaces?: BoolFieldUpdateOperationsInput | boolean
    autoFormat?: BoolFieldUpdateOperationsInput | boolean
    formatOnSave?: BoolFieldUpdateOperationsInput | boolean
    autoSave?: BoolFieldUpdateOperationsInput | boolean
    autoSaveDelay?: IntFieldUpdateOperationsInput | number
    wordWrap?: BoolFieldUpdateOperationsInput | boolean
    minimap?: BoolFieldUpdateOperationsInput | boolean
    lineNumbers?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    fontSize?: IntFieldUpdateOperationsInput | number
    fontFamily?: StringFieldUpdateOperationsInput | string
    lineHeight?: FloatFieldUpdateOperationsInput | number
    tabSize?: IntFieldUpdateOperationsInput | number
    useSpaces?: BoolFieldUpdateOperationsInput | boolean
    autoFormat?: BoolFieldUpdateOperationsInput | boolean
    formatOnSave?: BoolFieldUpdateOperationsInput | boolean
    autoSave?: BoolFieldUpdateOperationsInput | boolean
    autoSaveDelay?: IntFieldUpdateOperationsInput | number
    wordWrap?: BoolFieldUpdateOperationsInput | boolean
    minimap?: BoolFieldUpdateOperationsInput | boolean
    lineNumbers?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkspaceSettingsCreateInput = {
    settings: string
    workspace: WorkspaceCreateNestedOneWithoutSettingsInput
  }

  export type WorkspaceSettingsUncheckedCreateInput = {
    workspaceId: string
    settings: string
  }

  export type WorkspaceSettingsUpdateInput = {
    settings?: StringFieldUpdateOperationsInput | string
    workspace?: WorkspaceUpdateOneRequiredWithoutSettingsNestedInput
  }

  export type WorkspaceSettingsUncheckedUpdateInput = {
    workspaceId?: StringFieldUpdateOperationsInput | string
    settings?: StringFieldUpdateOperationsInput | string
  }

  export type WorkspaceSettingsCreateManyInput = {
    workspaceId: string
    settings: string
  }

  export type WorkspaceSettingsUpdateManyMutationInput = {
    settings?: StringFieldUpdateOperationsInput | string
  }

  export type WorkspaceSettingsUncheckedUpdateManyInput = {
    workspaceId?: StringFieldUpdateOperationsInput | string
    settings?: StringFieldUpdateOperationsInput | string
  }

  export type EditorStateCreateInput = {
    activeTabId?: string | null
    lastSaved?: Date | string | null
    workspace: WorkspaceCreateNestedOneWithoutEditorStateInput
    tabs?: TabStateCreateNestedManyWithoutEditorStateInput
  }

  export type EditorStateUncheckedCreateInput = {
    workspaceId: string
    activeTabId?: string | null
    lastSaved?: Date | string | null
    tabs?: TabStateUncheckedCreateNestedManyWithoutEditorStateInput
  }

  export type EditorStateUpdateInput = {
    activeTabId?: NullableStringFieldUpdateOperationsInput | string | null
    lastSaved?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    workspace?: WorkspaceUpdateOneRequiredWithoutEditorStateNestedInput
    tabs?: TabStateUpdateManyWithoutEditorStateNestedInput
  }

  export type EditorStateUncheckedUpdateInput = {
    workspaceId?: StringFieldUpdateOperationsInput | string
    activeTabId?: NullableStringFieldUpdateOperationsInput | string | null
    lastSaved?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tabs?: TabStateUncheckedUpdateManyWithoutEditorStateNestedInput
  }

  export type EditorStateCreateManyInput = {
    workspaceId: string
    activeTabId?: string | null
    lastSaved?: Date | string | null
  }

  export type EditorStateUpdateManyMutationInput = {
    activeTabId?: NullableStringFieldUpdateOperationsInput | string | null
    lastSaved?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type EditorStateUncheckedUpdateManyInput = {
    workspaceId?: StringFieldUpdateOperationsInput | string
    activeTabId?: NullableStringFieldUpdateOperationsInput | string | null
    lastSaved?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TabStateCreateInput = {
    id?: string
    path: string
    title: string
    isDirty?: boolean
    isActive?: boolean
    cursorLine?: number
    cursorColumn?: number
    scrollTop?: number
    editorState: EditorStateCreateNestedOneWithoutTabsInput
  }

  export type TabStateUncheckedCreateInput = {
    id?: string
    editorStateId: string
    path: string
    title: string
    isDirty?: boolean
    isActive?: boolean
    cursorLine?: number
    cursorColumn?: number
    scrollTop?: number
  }

  export type TabStateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    isDirty?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    cursorLine?: IntFieldUpdateOperationsInput | number
    cursorColumn?: IntFieldUpdateOperationsInput | number
    scrollTop?: IntFieldUpdateOperationsInput | number
    editorState?: EditorStateUpdateOneRequiredWithoutTabsNestedInput
  }

  export type TabStateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    editorStateId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    isDirty?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    cursorLine?: IntFieldUpdateOperationsInput | number
    cursorColumn?: IntFieldUpdateOperationsInput | number
    scrollTop?: IntFieldUpdateOperationsInput | number
  }

  export type TabStateCreateManyInput = {
    id?: string
    editorStateId: string
    path: string
    title: string
    isDirty?: boolean
    isActive?: boolean
    cursorLine?: number
    cursorColumn?: number
    scrollTop?: number
  }

  export type TabStateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    isDirty?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    cursorLine?: IntFieldUpdateOperationsInput | number
    cursorColumn?: IntFieldUpdateOperationsInput | number
    scrollTop?: IntFieldUpdateOperationsInput | number
  }

  export type TabStateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    editorStateId?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    isDirty?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    cursorLine?: IntFieldUpdateOperationsInput | number
    cursorColumn?: IntFieldUpdateOperationsInput | number
    scrollTop?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type WorkspaceListRelationFilter = {
    every?: WorkspaceWhereInput
    some?: WorkspaceWhereInput
    none?: WorkspaceWhereInput
  }

  export type UserSettingsNullableScalarRelationFilter = {
    is?: UserSettingsWhereInput | null
    isNot?: UserSettingsWhereInput | null
  }

  export type ExtensionListRelationFilter = {
    every?: ExtensionWhereInput
    some?: ExtensionWhereInput
    none?: ExtensionWhereInput
  }

  export type UserExtensionListRelationFilter = {
    every?: UserExtensionWhereInput
    some?: UserExtensionWhereInput
    none?: UserExtensionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type WorkspaceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExtensionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserExtensionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLogin?: SortOrder
    bio?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLogin?: SortOrder
    bio?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLogin?: SortOrder
    bio?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ExtensionVersionListRelationFilter = {
    every?: ExtensionVersionWhereInput
    some?: ExtensionVersionWhereInput
    none?: ExtensionVersionWhereInput
  }

  export type ExtensionVersionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExtensionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    gitUrl?: SortOrder
    gitBranch?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    active?: SortOrder
    installedVersionId?: SortOrder
  }

  export type ExtensionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    gitUrl?: SortOrder
    gitBranch?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    active?: SortOrder
    installedVersionId?: SortOrder
  }

  export type ExtensionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    gitUrl?: SortOrder
    gitBranch?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    active?: SortOrder
    installedVersionId?: SortOrder
  }

  export type ExtensionScalarRelationFilter = {
    is?: ExtensionWhereInput
    isNot?: ExtensionWhereInput
  }

  export type ExtensionVersionCountOrderByAggregateInput = {
    id?: SortOrder
    extensionId?: SortOrder
    version?: SortOrder
    gitUrl?: SortOrder
    gitBranch?: SortOrder
    status?: SortOrder
    buildLogs?: SortOrder
    entryPointUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type ExtensionVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    extensionId?: SortOrder
    version?: SortOrder
    gitUrl?: SortOrder
    gitBranch?: SortOrder
    status?: SortOrder
    buildLogs?: SortOrder
    entryPointUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type ExtensionVersionMinOrderByAggregateInput = {
    id?: SortOrder
    extensionId?: SortOrder
    version?: SortOrder
    gitUrl?: SortOrder
    gitBranch?: SortOrder
    status?: SortOrder
    buildLogs?: SortOrder
    entryPointUrl?: SortOrder
    createdAt?: SortOrder
  }

  export type ExtensionVersionScalarRelationFilter = {
    is?: ExtensionVersionWhereInput
    isNot?: ExtensionVersionWhereInput
  }

  export type UserExtensionUserIdExtensionIdCompoundUniqueInput = {
    userId: string
    extensionId: string
  }

  export type UserExtensionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    extensionId?: SortOrder
    installedVersionId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserExtensionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    extensionId?: SortOrder
    installedVersionId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserExtensionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    extensionId?: SortOrder
    installedVersionId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceSettingsNullableScalarRelationFilter = {
    is?: WorkspaceSettingsWhereInput | null
    isNot?: WorkspaceSettingsWhereInput | null
  }

  export type EditorStateNullableScalarRelationFilter = {
    is?: EditorStateWhereInput | null
    isNot?: EditorStateWhereInput | null
  }

  export type WorkspaceSecretListRelationFilter = {
    every?: WorkspaceSecretWhereInput
    some?: WorkspaceSecretWhereInput
    none?: WorkspaceSecretWhereInput
  }

  export type WorkspaceSecretOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkspaceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    ownerId?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    ownerId?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    ownerId?: SortOrder
    isPublic?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceScalarRelationFilter = {
    is?: WorkspaceWhereInput
    isNot?: WorkspaceWhereInput
  }

  export type WorkspaceSecretWorkspaceIdKeyCompoundUniqueInput = {
    workspaceId: string
    key: string
  }

  export type WorkspaceSecretCountOrderByAggregateInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceSecretMaxOrderByAggregateInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkspaceSecretMinOrderByAggregateInput = {
    id?: SortOrder
    workspaceId?: SortOrder
    key?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type UserSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    fontSize?: SortOrder
    fontFamily?: SortOrder
    lineHeight?: SortOrder
    tabSize?: SortOrder
    useSpaces?: SortOrder
    autoFormat?: SortOrder
    formatOnSave?: SortOrder
    autoSave?: SortOrder
    autoSaveDelay?: SortOrder
    wordWrap?: SortOrder
    minimap?: SortOrder
    lineNumbers?: SortOrder
  }

  export type UserSettingsAvgOrderByAggregateInput = {
    fontSize?: SortOrder
    lineHeight?: SortOrder
    tabSize?: SortOrder
    autoSaveDelay?: SortOrder
  }

  export type UserSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    fontSize?: SortOrder
    fontFamily?: SortOrder
    lineHeight?: SortOrder
    tabSize?: SortOrder
    useSpaces?: SortOrder
    autoFormat?: SortOrder
    formatOnSave?: SortOrder
    autoSave?: SortOrder
    autoSaveDelay?: SortOrder
    wordWrap?: SortOrder
    minimap?: SortOrder
    lineNumbers?: SortOrder
  }

  export type UserSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    fontSize?: SortOrder
    fontFamily?: SortOrder
    lineHeight?: SortOrder
    tabSize?: SortOrder
    useSpaces?: SortOrder
    autoFormat?: SortOrder
    formatOnSave?: SortOrder
    autoSave?: SortOrder
    autoSaveDelay?: SortOrder
    wordWrap?: SortOrder
    minimap?: SortOrder
    lineNumbers?: SortOrder
  }

  export type UserSettingsSumOrderByAggregateInput = {
    fontSize?: SortOrder
    lineHeight?: SortOrder
    tabSize?: SortOrder
    autoSaveDelay?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type WorkspaceSettingsCountOrderByAggregateInput = {
    workspaceId?: SortOrder
    settings?: SortOrder
  }

  export type WorkspaceSettingsMaxOrderByAggregateInput = {
    workspaceId?: SortOrder
    settings?: SortOrder
  }

  export type WorkspaceSettingsMinOrderByAggregateInput = {
    workspaceId?: SortOrder
    settings?: SortOrder
  }

  export type TabStateListRelationFilter = {
    every?: TabStateWhereInput
    some?: TabStateWhereInput
    none?: TabStateWhereInput
  }

  export type TabStateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EditorStateCountOrderByAggregateInput = {
    workspaceId?: SortOrder
    activeTabId?: SortOrder
    lastSaved?: SortOrder
  }

  export type EditorStateMaxOrderByAggregateInput = {
    workspaceId?: SortOrder
    activeTabId?: SortOrder
    lastSaved?: SortOrder
  }

  export type EditorStateMinOrderByAggregateInput = {
    workspaceId?: SortOrder
    activeTabId?: SortOrder
    lastSaved?: SortOrder
  }

  export type EditorStateScalarRelationFilter = {
    is?: EditorStateWhereInput
    isNot?: EditorStateWhereInput
  }

  export type TabStateCountOrderByAggregateInput = {
    id?: SortOrder
    editorStateId?: SortOrder
    path?: SortOrder
    title?: SortOrder
    isDirty?: SortOrder
    isActive?: SortOrder
    cursorLine?: SortOrder
    cursorColumn?: SortOrder
    scrollTop?: SortOrder
  }

  export type TabStateAvgOrderByAggregateInput = {
    cursorLine?: SortOrder
    cursorColumn?: SortOrder
    scrollTop?: SortOrder
  }

  export type TabStateMaxOrderByAggregateInput = {
    id?: SortOrder
    editorStateId?: SortOrder
    path?: SortOrder
    title?: SortOrder
    isDirty?: SortOrder
    isActive?: SortOrder
    cursorLine?: SortOrder
    cursorColumn?: SortOrder
    scrollTop?: SortOrder
  }

  export type TabStateMinOrderByAggregateInput = {
    id?: SortOrder
    editorStateId?: SortOrder
    path?: SortOrder
    title?: SortOrder
    isDirty?: SortOrder
    isActive?: SortOrder
    cursorLine?: SortOrder
    cursorColumn?: SortOrder
    scrollTop?: SortOrder
  }

  export type TabStateSumOrderByAggregateInput = {
    cursorLine?: SortOrder
    cursorColumn?: SortOrder
    scrollTop?: SortOrder
  }

  export type WorkspaceCreateNestedManyWithoutOwnerInput = {
    create?: XOR<WorkspaceCreateWithoutOwnerInput, WorkspaceUncheckedCreateWithoutOwnerInput> | WorkspaceCreateWithoutOwnerInput[] | WorkspaceUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutOwnerInput | WorkspaceCreateOrConnectWithoutOwnerInput[]
    createMany?: WorkspaceCreateManyOwnerInputEnvelope
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
  }

  export type UserSettingsCreateNestedOneWithoutUserInput = {
    create?: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingsCreateOrConnectWithoutUserInput
    connect?: UserSettingsWhereUniqueInput
  }

  export type ExtensionCreateNestedManyWithoutAuthorInput = {
    create?: XOR<ExtensionCreateWithoutAuthorInput, ExtensionUncheckedCreateWithoutAuthorInput> | ExtensionCreateWithoutAuthorInput[] | ExtensionUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ExtensionCreateOrConnectWithoutAuthorInput | ExtensionCreateOrConnectWithoutAuthorInput[]
    createMany?: ExtensionCreateManyAuthorInputEnvelope
    connect?: ExtensionWhereUniqueInput | ExtensionWhereUniqueInput[]
  }

  export type UserExtensionCreateNestedManyWithoutUserInput = {
    create?: XOR<UserExtensionCreateWithoutUserInput, UserExtensionUncheckedCreateWithoutUserInput> | UserExtensionCreateWithoutUserInput[] | UserExtensionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserExtensionCreateOrConnectWithoutUserInput | UserExtensionCreateOrConnectWithoutUserInput[]
    createMany?: UserExtensionCreateManyUserInputEnvelope
    connect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
  }

  export type WorkspaceUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<WorkspaceCreateWithoutOwnerInput, WorkspaceUncheckedCreateWithoutOwnerInput> | WorkspaceCreateWithoutOwnerInput[] | WorkspaceUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutOwnerInput | WorkspaceCreateOrConnectWithoutOwnerInput[]
    createMany?: WorkspaceCreateManyOwnerInputEnvelope
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
  }

  export type UserSettingsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingsCreateOrConnectWithoutUserInput
    connect?: UserSettingsWhereUniqueInput
  }

  export type ExtensionUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<ExtensionCreateWithoutAuthorInput, ExtensionUncheckedCreateWithoutAuthorInput> | ExtensionCreateWithoutAuthorInput[] | ExtensionUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ExtensionCreateOrConnectWithoutAuthorInput | ExtensionCreateOrConnectWithoutAuthorInput[]
    createMany?: ExtensionCreateManyAuthorInputEnvelope
    connect?: ExtensionWhereUniqueInput | ExtensionWhereUniqueInput[]
  }

  export type UserExtensionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserExtensionCreateWithoutUserInput, UserExtensionUncheckedCreateWithoutUserInput> | UserExtensionCreateWithoutUserInput[] | UserExtensionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserExtensionCreateOrConnectWithoutUserInput | UserExtensionCreateOrConnectWithoutUserInput[]
    createMany?: UserExtensionCreateManyUserInputEnvelope
    connect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type WorkspaceUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<WorkspaceCreateWithoutOwnerInput, WorkspaceUncheckedCreateWithoutOwnerInput> | WorkspaceCreateWithoutOwnerInput[] | WorkspaceUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutOwnerInput | WorkspaceCreateOrConnectWithoutOwnerInput[]
    upsert?: WorkspaceUpsertWithWhereUniqueWithoutOwnerInput | WorkspaceUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: WorkspaceCreateManyOwnerInputEnvelope
    set?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    disconnect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    delete?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    update?: WorkspaceUpdateWithWhereUniqueWithoutOwnerInput | WorkspaceUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: WorkspaceUpdateManyWithWhereWithoutOwnerInput | WorkspaceUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
  }

  export type UserSettingsUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingsCreateOrConnectWithoutUserInput
    upsert?: UserSettingsUpsertWithoutUserInput
    disconnect?: UserSettingsWhereInput | boolean
    delete?: UserSettingsWhereInput | boolean
    connect?: UserSettingsWhereUniqueInput
    update?: XOR<XOR<UserSettingsUpdateToOneWithWhereWithoutUserInput, UserSettingsUpdateWithoutUserInput>, UserSettingsUncheckedUpdateWithoutUserInput>
  }

  export type ExtensionUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<ExtensionCreateWithoutAuthorInput, ExtensionUncheckedCreateWithoutAuthorInput> | ExtensionCreateWithoutAuthorInput[] | ExtensionUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ExtensionCreateOrConnectWithoutAuthorInput | ExtensionCreateOrConnectWithoutAuthorInput[]
    upsert?: ExtensionUpsertWithWhereUniqueWithoutAuthorInput | ExtensionUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: ExtensionCreateManyAuthorInputEnvelope
    set?: ExtensionWhereUniqueInput | ExtensionWhereUniqueInput[]
    disconnect?: ExtensionWhereUniqueInput | ExtensionWhereUniqueInput[]
    delete?: ExtensionWhereUniqueInput | ExtensionWhereUniqueInput[]
    connect?: ExtensionWhereUniqueInput | ExtensionWhereUniqueInput[]
    update?: ExtensionUpdateWithWhereUniqueWithoutAuthorInput | ExtensionUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: ExtensionUpdateManyWithWhereWithoutAuthorInput | ExtensionUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: ExtensionScalarWhereInput | ExtensionScalarWhereInput[]
  }

  export type UserExtensionUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserExtensionCreateWithoutUserInput, UserExtensionUncheckedCreateWithoutUserInput> | UserExtensionCreateWithoutUserInput[] | UserExtensionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserExtensionCreateOrConnectWithoutUserInput | UserExtensionCreateOrConnectWithoutUserInput[]
    upsert?: UserExtensionUpsertWithWhereUniqueWithoutUserInput | UserExtensionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserExtensionCreateManyUserInputEnvelope
    set?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    disconnect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    delete?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    connect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    update?: UserExtensionUpdateWithWhereUniqueWithoutUserInput | UserExtensionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserExtensionUpdateManyWithWhereWithoutUserInput | UserExtensionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserExtensionScalarWhereInput | UserExtensionScalarWhereInput[]
  }

  export type WorkspaceUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<WorkspaceCreateWithoutOwnerInput, WorkspaceUncheckedCreateWithoutOwnerInput> | WorkspaceCreateWithoutOwnerInput[] | WorkspaceUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutOwnerInput | WorkspaceCreateOrConnectWithoutOwnerInput[]
    upsert?: WorkspaceUpsertWithWhereUniqueWithoutOwnerInput | WorkspaceUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: WorkspaceCreateManyOwnerInputEnvelope
    set?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    disconnect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    delete?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    update?: WorkspaceUpdateWithWhereUniqueWithoutOwnerInput | WorkspaceUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: WorkspaceUpdateManyWithWhereWithoutOwnerInput | WorkspaceUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
  }

  export type UserSettingsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserSettingsCreateOrConnectWithoutUserInput
    upsert?: UserSettingsUpsertWithoutUserInput
    disconnect?: UserSettingsWhereInput | boolean
    delete?: UserSettingsWhereInput | boolean
    connect?: UserSettingsWhereUniqueInput
    update?: XOR<XOR<UserSettingsUpdateToOneWithWhereWithoutUserInput, UserSettingsUpdateWithoutUserInput>, UserSettingsUncheckedUpdateWithoutUserInput>
  }

  export type ExtensionUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<ExtensionCreateWithoutAuthorInput, ExtensionUncheckedCreateWithoutAuthorInput> | ExtensionCreateWithoutAuthorInput[] | ExtensionUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: ExtensionCreateOrConnectWithoutAuthorInput | ExtensionCreateOrConnectWithoutAuthorInput[]
    upsert?: ExtensionUpsertWithWhereUniqueWithoutAuthorInput | ExtensionUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: ExtensionCreateManyAuthorInputEnvelope
    set?: ExtensionWhereUniqueInput | ExtensionWhereUniqueInput[]
    disconnect?: ExtensionWhereUniqueInput | ExtensionWhereUniqueInput[]
    delete?: ExtensionWhereUniqueInput | ExtensionWhereUniqueInput[]
    connect?: ExtensionWhereUniqueInput | ExtensionWhereUniqueInput[]
    update?: ExtensionUpdateWithWhereUniqueWithoutAuthorInput | ExtensionUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: ExtensionUpdateManyWithWhereWithoutAuthorInput | ExtensionUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: ExtensionScalarWhereInput | ExtensionScalarWhereInput[]
  }

  export type UserExtensionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserExtensionCreateWithoutUserInput, UserExtensionUncheckedCreateWithoutUserInput> | UserExtensionCreateWithoutUserInput[] | UserExtensionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserExtensionCreateOrConnectWithoutUserInput | UserExtensionCreateOrConnectWithoutUserInput[]
    upsert?: UserExtensionUpsertWithWhereUniqueWithoutUserInput | UserExtensionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserExtensionCreateManyUserInputEnvelope
    set?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    disconnect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    delete?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    connect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    update?: UserExtensionUpdateWithWhereUniqueWithoutUserInput | UserExtensionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserExtensionUpdateManyWithWhereWithoutUserInput | UserExtensionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserExtensionScalarWhereInput | UserExtensionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutExtensionsInput = {
    create?: XOR<UserCreateWithoutExtensionsInput, UserUncheckedCreateWithoutExtensionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExtensionsInput
    connect?: UserWhereUniqueInput
  }

  export type ExtensionVersionCreateNestedManyWithoutExtensionInput = {
    create?: XOR<ExtensionVersionCreateWithoutExtensionInput, ExtensionVersionUncheckedCreateWithoutExtensionInput> | ExtensionVersionCreateWithoutExtensionInput[] | ExtensionVersionUncheckedCreateWithoutExtensionInput[]
    connectOrCreate?: ExtensionVersionCreateOrConnectWithoutExtensionInput | ExtensionVersionCreateOrConnectWithoutExtensionInput[]
    createMany?: ExtensionVersionCreateManyExtensionInputEnvelope
    connect?: ExtensionVersionWhereUniqueInput | ExtensionVersionWhereUniqueInput[]
  }

  export type UserExtensionCreateNestedManyWithoutExtensionInput = {
    create?: XOR<UserExtensionCreateWithoutExtensionInput, UserExtensionUncheckedCreateWithoutExtensionInput> | UserExtensionCreateWithoutExtensionInput[] | UserExtensionUncheckedCreateWithoutExtensionInput[]
    connectOrCreate?: UserExtensionCreateOrConnectWithoutExtensionInput | UserExtensionCreateOrConnectWithoutExtensionInput[]
    createMany?: UserExtensionCreateManyExtensionInputEnvelope
    connect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
  }

  export type ExtensionVersionUncheckedCreateNestedManyWithoutExtensionInput = {
    create?: XOR<ExtensionVersionCreateWithoutExtensionInput, ExtensionVersionUncheckedCreateWithoutExtensionInput> | ExtensionVersionCreateWithoutExtensionInput[] | ExtensionVersionUncheckedCreateWithoutExtensionInput[]
    connectOrCreate?: ExtensionVersionCreateOrConnectWithoutExtensionInput | ExtensionVersionCreateOrConnectWithoutExtensionInput[]
    createMany?: ExtensionVersionCreateManyExtensionInputEnvelope
    connect?: ExtensionVersionWhereUniqueInput | ExtensionVersionWhereUniqueInput[]
  }

  export type UserExtensionUncheckedCreateNestedManyWithoutExtensionInput = {
    create?: XOR<UserExtensionCreateWithoutExtensionInput, UserExtensionUncheckedCreateWithoutExtensionInput> | UserExtensionCreateWithoutExtensionInput[] | UserExtensionUncheckedCreateWithoutExtensionInput[]
    connectOrCreate?: UserExtensionCreateOrConnectWithoutExtensionInput | UserExtensionCreateOrConnectWithoutExtensionInput[]
    createMany?: UserExtensionCreateManyExtensionInputEnvelope
    connect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutExtensionsNestedInput = {
    create?: XOR<UserCreateWithoutExtensionsInput, UserUncheckedCreateWithoutExtensionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutExtensionsInput
    upsert?: UserUpsertWithoutExtensionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutExtensionsInput, UserUpdateWithoutExtensionsInput>, UserUncheckedUpdateWithoutExtensionsInput>
  }

  export type ExtensionVersionUpdateManyWithoutExtensionNestedInput = {
    create?: XOR<ExtensionVersionCreateWithoutExtensionInput, ExtensionVersionUncheckedCreateWithoutExtensionInput> | ExtensionVersionCreateWithoutExtensionInput[] | ExtensionVersionUncheckedCreateWithoutExtensionInput[]
    connectOrCreate?: ExtensionVersionCreateOrConnectWithoutExtensionInput | ExtensionVersionCreateOrConnectWithoutExtensionInput[]
    upsert?: ExtensionVersionUpsertWithWhereUniqueWithoutExtensionInput | ExtensionVersionUpsertWithWhereUniqueWithoutExtensionInput[]
    createMany?: ExtensionVersionCreateManyExtensionInputEnvelope
    set?: ExtensionVersionWhereUniqueInput | ExtensionVersionWhereUniqueInput[]
    disconnect?: ExtensionVersionWhereUniqueInput | ExtensionVersionWhereUniqueInput[]
    delete?: ExtensionVersionWhereUniqueInput | ExtensionVersionWhereUniqueInput[]
    connect?: ExtensionVersionWhereUniqueInput | ExtensionVersionWhereUniqueInput[]
    update?: ExtensionVersionUpdateWithWhereUniqueWithoutExtensionInput | ExtensionVersionUpdateWithWhereUniqueWithoutExtensionInput[]
    updateMany?: ExtensionVersionUpdateManyWithWhereWithoutExtensionInput | ExtensionVersionUpdateManyWithWhereWithoutExtensionInput[]
    deleteMany?: ExtensionVersionScalarWhereInput | ExtensionVersionScalarWhereInput[]
  }

  export type UserExtensionUpdateManyWithoutExtensionNestedInput = {
    create?: XOR<UserExtensionCreateWithoutExtensionInput, UserExtensionUncheckedCreateWithoutExtensionInput> | UserExtensionCreateWithoutExtensionInput[] | UserExtensionUncheckedCreateWithoutExtensionInput[]
    connectOrCreate?: UserExtensionCreateOrConnectWithoutExtensionInput | UserExtensionCreateOrConnectWithoutExtensionInput[]
    upsert?: UserExtensionUpsertWithWhereUniqueWithoutExtensionInput | UserExtensionUpsertWithWhereUniqueWithoutExtensionInput[]
    createMany?: UserExtensionCreateManyExtensionInputEnvelope
    set?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    disconnect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    delete?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    connect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    update?: UserExtensionUpdateWithWhereUniqueWithoutExtensionInput | UserExtensionUpdateWithWhereUniqueWithoutExtensionInput[]
    updateMany?: UserExtensionUpdateManyWithWhereWithoutExtensionInput | UserExtensionUpdateManyWithWhereWithoutExtensionInput[]
    deleteMany?: UserExtensionScalarWhereInput | UserExtensionScalarWhereInput[]
  }

  export type ExtensionVersionUncheckedUpdateManyWithoutExtensionNestedInput = {
    create?: XOR<ExtensionVersionCreateWithoutExtensionInput, ExtensionVersionUncheckedCreateWithoutExtensionInput> | ExtensionVersionCreateWithoutExtensionInput[] | ExtensionVersionUncheckedCreateWithoutExtensionInput[]
    connectOrCreate?: ExtensionVersionCreateOrConnectWithoutExtensionInput | ExtensionVersionCreateOrConnectWithoutExtensionInput[]
    upsert?: ExtensionVersionUpsertWithWhereUniqueWithoutExtensionInput | ExtensionVersionUpsertWithWhereUniqueWithoutExtensionInput[]
    createMany?: ExtensionVersionCreateManyExtensionInputEnvelope
    set?: ExtensionVersionWhereUniqueInput | ExtensionVersionWhereUniqueInput[]
    disconnect?: ExtensionVersionWhereUniqueInput | ExtensionVersionWhereUniqueInput[]
    delete?: ExtensionVersionWhereUniqueInput | ExtensionVersionWhereUniqueInput[]
    connect?: ExtensionVersionWhereUniqueInput | ExtensionVersionWhereUniqueInput[]
    update?: ExtensionVersionUpdateWithWhereUniqueWithoutExtensionInput | ExtensionVersionUpdateWithWhereUniqueWithoutExtensionInput[]
    updateMany?: ExtensionVersionUpdateManyWithWhereWithoutExtensionInput | ExtensionVersionUpdateManyWithWhereWithoutExtensionInput[]
    deleteMany?: ExtensionVersionScalarWhereInput | ExtensionVersionScalarWhereInput[]
  }

  export type UserExtensionUncheckedUpdateManyWithoutExtensionNestedInput = {
    create?: XOR<UserExtensionCreateWithoutExtensionInput, UserExtensionUncheckedCreateWithoutExtensionInput> | UserExtensionCreateWithoutExtensionInput[] | UserExtensionUncheckedCreateWithoutExtensionInput[]
    connectOrCreate?: UserExtensionCreateOrConnectWithoutExtensionInput | UserExtensionCreateOrConnectWithoutExtensionInput[]
    upsert?: UserExtensionUpsertWithWhereUniqueWithoutExtensionInput | UserExtensionUpsertWithWhereUniqueWithoutExtensionInput[]
    createMany?: UserExtensionCreateManyExtensionInputEnvelope
    set?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    disconnect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    delete?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    connect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    update?: UserExtensionUpdateWithWhereUniqueWithoutExtensionInput | UserExtensionUpdateWithWhereUniqueWithoutExtensionInput[]
    updateMany?: UserExtensionUpdateManyWithWhereWithoutExtensionInput | UserExtensionUpdateManyWithWhereWithoutExtensionInput[]
    deleteMany?: UserExtensionScalarWhereInput | UserExtensionScalarWhereInput[]
  }

  export type ExtensionCreateNestedOneWithoutVersionsInput = {
    create?: XOR<ExtensionCreateWithoutVersionsInput, ExtensionUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: ExtensionCreateOrConnectWithoutVersionsInput
    connect?: ExtensionWhereUniqueInput
  }

  export type UserExtensionCreateNestedManyWithoutInstalledVersionInput = {
    create?: XOR<UserExtensionCreateWithoutInstalledVersionInput, UserExtensionUncheckedCreateWithoutInstalledVersionInput> | UserExtensionCreateWithoutInstalledVersionInput[] | UserExtensionUncheckedCreateWithoutInstalledVersionInput[]
    connectOrCreate?: UserExtensionCreateOrConnectWithoutInstalledVersionInput | UserExtensionCreateOrConnectWithoutInstalledVersionInput[]
    createMany?: UserExtensionCreateManyInstalledVersionInputEnvelope
    connect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
  }

  export type UserExtensionUncheckedCreateNestedManyWithoutInstalledVersionInput = {
    create?: XOR<UserExtensionCreateWithoutInstalledVersionInput, UserExtensionUncheckedCreateWithoutInstalledVersionInput> | UserExtensionCreateWithoutInstalledVersionInput[] | UserExtensionUncheckedCreateWithoutInstalledVersionInput[]
    connectOrCreate?: UserExtensionCreateOrConnectWithoutInstalledVersionInput | UserExtensionCreateOrConnectWithoutInstalledVersionInput[]
    createMany?: UserExtensionCreateManyInstalledVersionInputEnvelope
    connect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
  }

  export type ExtensionUpdateOneRequiredWithoutVersionsNestedInput = {
    create?: XOR<ExtensionCreateWithoutVersionsInput, ExtensionUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: ExtensionCreateOrConnectWithoutVersionsInput
    upsert?: ExtensionUpsertWithoutVersionsInput
    connect?: ExtensionWhereUniqueInput
    update?: XOR<XOR<ExtensionUpdateToOneWithWhereWithoutVersionsInput, ExtensionUpdateWithoutVersionsInput>, ExtensionUncheckedUpdateWithoutVersionsInput>
  }

  export type UserExtensionUpdateManyWithoutInstalledVersionNestedInput = {
    create?: XOR<UserExtensionCreateWithoutInstalledVersionInput, UserExtensionUncheckedCreateWithoutInstalledVersionInput> | UserExtensionCreateWithoutInstalledVersionInput[] | UserExtensionUncheckedCreateWithoutInstalledVersionInput[]
    connectOrCreate?: UserExtensionCreateOrConnectWithoutInstalledVersionInput | UserExtensionCreateOrConnectWithoutInstalledVersionInput[]
    upsert?: UserExtensionUpsertWithWhereUniqueWithoutInstalledVersionInput | UserExtensionUpsertWithWhereUniqueWithoutInstalledVersionInput[]
    createMany?: UserExtensionCreateManyInstalledVersionInputEnvelope
    set?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    disconnect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    delete?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    connect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    update?: UserExtensionUpdateWithWhereUniqueWithoutInstalledVersionInput | UserExtensionUpdateWithWhereUniqueWithoutInstalledVersionInput[]
    updateMany?: UserExtensionUpdateManyWithWhereWithoutInstalledVersionInput | UserExtensionUpdateManyWithWhereWithoutInstalledVersionInput[]
    deleteMany?: UserExtensionScalarWhereInput | UserExtensionScalarWhereInput[]
  }

  export type UserExtensionUncheckedUpdateManyWithoutInstalledVersionNestedInput = {
    create?: XOR<UserExtensionCreateWithoutInstalledVersionInput, UserExtensionUncheckedCreateWithoutInstalledVersionInput> | UserExtensionCreateWithoutInstalledVersionInput[] | UserExtensionUncheckedCreateWithoutInstalledVersionInput[]
    connectOrCreate?: UserExtensionCreateOrConnectWithoutInstalledVersionInput | UserExtensionCreateOrConnectWithoutInstalledVersionInput[]
    upsert?: UserExtensionUpsertWithWhereUniqueWithoutInstalledVersionInput | UserExtensionUpsertWithWhereUniqueWithoutInstalledVersionInput[]
    createMany?: UserExtensionCreateManyInstalledVersionInputEnvelope
    set?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    disconnect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    delete?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    connect?: UserExtensionWhereUniqueInput | UserExtensionWhereUniqueInput[]
    update?: UserExtensionUpdateWithWhereUniqueWithoutInstalledVersionInput | UserExtensionUpdateWithWhereUniqueWithoutInstalledVersionInput[]
    updateMany?: UserExtensionUpdateManyWithWhereWithoutInstalledVersionInput | UserExtensionUpdateManyWithWhereWithoutInstalledVersionInput[]
    deleteMany?: UserExtensionScalarWhereInput | UserExtensionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutUserExtensionsInput = {
    create?: XOR<UserCreateWithoutUserExtensionsInput, UserUncheckedCreateWithoutUserExtensionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserExtensionsInput
    connect?: UserWhereUniqueInput
  }

  export type ExtensionCreateNestedOneWithoutInstallationsInput = {
    create?: XOR<ExtensionCreateWithoutInstallationsInput, ExtensionUncheckedCreateWithoutInstallationsInput>
    connectOrCreate?: ExtensionCreateOrConnectWithoutInstallationsInput
    connect?: ExtensionWhereUniqueInput
  }

  export type ExtensionVersionCreateNestedOneWithoutInstallationsInput = {
    create?: XOR<ExtensionVersionCreateWithoutInstallationsInput, ExtensionVersionUncheckedCreateWithoutInstallationsInput>
    connectOrCreate?: ExtensionVersionCreateOrConnectWithoutInstallationsInput
    connect?: ExtensionVersionWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUserExtensionsNestedInput = {
    create?: XOR<UserCreateWithoutUserExtensionsInput, UserUncheckedCreateWithoutUserExtensionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserExtensionsInput
    upsert?: UserUpsertWithoutUserExtensionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserExtensionsInput, UserUpdateWithoutUserExtensionsInput>, UserUncheckedUpdateWithoutUserExtensionsInput>
  }

  export type ExtensionUpdateOneRequiredWithoutInstallationsNestedInput = {
    create?: XOR<ExtensionCreateWithoutInstallationsInput, ExtensionUncheckedCreateWithoutInstallationsInput>
    connectOrCreate?: ExtensionCreateOrConnectWithoutInstallationsInput
    upsert?: ExtensionUpsertWithoutInstallationsInput
    connect?: ExtensionWhereUniqueInput
    update?: XOR<XOR<ExtensionUpdateToOneWithWhereWithoutInstallationsInput, ExtensionUpdateWithoutInstallationsInput>, ExtensionUncheckedUpdateWithoutInstallationsInput>
  }

  export type ExtensionVersionUpdateOneRequiredWithoutInstallationsNestedInput = {
    create?: XOR<ExtensionVersionCreateWithoutInstallationsInput, ExtensionVersionUncheckedCreateWithoutInstallationsInput>
    connectOrCreate?: ExtensionVersionCreateOrConnectWithoutInstallationsInput
    upsert?: ExtensionVersionUpsertWithoutInstallationsInput
    connect?: ExtensionVersionWhereUniqueInput
    update?: XOR<XOR<ExtensionVersionUpdateToOneWithWhereWithoutInstallationsInput, ExtensionVersionUpdateWithoutInstallationsInput>, ExtensionVersionUncheckedUpdateWithoutInstallationsInput>
  }

  export type UserCreateNestedOneWithoutWorkspacesInput = {
    create?: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkspacesInput
    connect?: UserWhereUniqueInput
  }

  export type WorkspaceSettingsCreateNestedOneWithoutWorkspaceInput = {
    create?: XOR<WorkspaceSettingsCreateWithoutWorkspaceInput, WorkspaceSettingsUncheckedCreateWithoutWorkspaceInput>
    connectOrCreate?: WorkspaceSettingsCreateOrConnectWithoutWorkspaceInput
    connect?: WorkspaceSettingsWhereUniqueInput
  }

  export type EditorStateCreateNestedOneWithoutWorkspaceInput = {
    create?: XOR<EditorStateCreateWithoutWorkspaceInput, EditorStateUncheckedCreateWithoutWorkspaceInput>
    connectOrCreate?: EditorStateCreateOrConnectWithoutWorkspaceInput
    connect?: EditorStateWhereUniqueInput
  }

  export type WorkspaceSecretCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<WorkspaceSecretCreateWithoutWorkspaceInput, WorkspaceSecretUncheckedCreateWithoutWorkspaceInput> | WorkspaceSecretCreateWithoutWorkspaceInput[] | WorkspaceSecretUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceSecretCreateOrConnectWithoutWorkspaceInput | WorkspaceSecretCreateOrConnectWithoutWorkspaceInput[]
    createMany?: WorkspaceSecretCreateManyWorkspaceInputEnvelope
    connect?: WorkspaceSecretWhereUniqueInput | WorkspaceSecretWhereUniqueInput[]
  }

  export type WorkspaceSettingsUncheckedCreateNestedOneWithoutWorkspaceInput = {
    create?: XOR<WorkspaceSettingsCreateWithoutWorkspaceInput, WorkspaceSettingsUncheckedCreateWithoutWorkspaceInput>
    connectOrCreate?: WorkspaceSettingsCreateOrConnectWithoutWorkspaceInput
    connect?: WorkspaceSettingsWhereUniqueInput
  }

  export type EditorStateUncheckedCreateNestedOneWithoutWorkspaceInput = {
    create?: XOR<EditorStateCreateWithoutWorkspaceInput, EditorStateUncheckedCreateWithoutWorkspaceInput>
    connectOrCreate?: EditorStateCreateOrConnectWithoutWorkspaceInput
    connect?: EditorStateWhereUniqueInput
  }

  export type WorkspaceSecretUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<WorkspaceSecretCreateWithoutWorkspaceInput, WorkspaceSecretUncheckedCreateWithoutWorkspaceInput> | WorkspaceSecretCreateWithoutWorkspaceInput[] | WorkspaceSecretUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceSecretCreateOrConnectWithoutWorkspaceInput | WorkspaceSecretCreateOrConnectWithoutWorkspaceInput[]
    createMany?: WorkspaceSecretCreateManyWorkspaceInputEnvelope
    connect?: WorkspaceSecretWhereUniqueInput | WorkspaceSecretWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutWorkspacesNestedInput = {
    create?: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput>
    connectOrCreate?: UserCreateOrConnectWithoutWorkspacesInput
    upsert?: UserUpsertWithoutWorkspacesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWorkspacesInput, UserUpdateWithoutWorkspacesInput>, UserUncheckedUpdateWithoutWorkspacesInput>
  }

  export type WorkspaceSettingsUpdateOneWithoutWorkspaceNestedInput = {
    create?: XOR<WorkspaceSettingsCreateWithoutWorkspaceInput, WorkspaceSettingsUncheckedCreateWithoutWorkspaceInput>
    connectOrCreate?: WorkspaceSettingsCreateOrConnectWithoutWorkspaceInput
    upsert?: WorkspaceSettingsUpsertWithoutWorkspaceInput
    disconnect?: WorkspaceSettingsWhereInput | boolean
    delete?: WorkspaceSettingsWhereInput | boolean
    connect?: WorkspaceSettingsWhereUniqueInput
    update?: XOR<XOR<WorkspaceSettingsUpdateToOneWithWhereWithoutWorkspaceInput, WorkspaceSettingsUpdateWithoutWorkspaceInput>, WorkspaceSettingsUncheckedUpdateWithoutWorkspaceInput>
  }

  export type EditorStateUpdateOneWithoutWorkspaceNestedInput = {
    create?: XOR<EditorStateCreateWithoutWorkspaceInput, EditorStateUncheckedCreateWithoutWorkspaceInput>
    connectOrCreate?: EditorStateCreateOrConnectWithoutWorkspaceInput
    upsert?: EditorStateUpsertWithoutWorkspaceInput
    disconnect?: EditorStateWhereInput | boolean
    delete?: EditorStateWhereInput | boolean
    connect?: EditorStateWhereUniqueInput
    update?: XOR<XOR<EditorStateUpdateToOneWithWhereWithoutWorkspaceInput, EditorStateUpdateWithoutWorkspaceInput>, EditorStateUncheckedUpdateWithoutWorkspaceInput>
  }

  export type WorkspaceSecretUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<WorkspaceSecretCreateWithoutWorkspaceInput, WorkspaceSecretUncheckedCreateWithoutWorkspaceInput> | WorkspaceSecretCreateWithoutWorkspaceInput[] | WorkspaceSecretUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceSecretCreateOrConnectWithoutWorkspaceInput | WorkspaceSecretCreateOrConnectWithoutWorkspaceInput[]
    upsert?: WorkspaceSecretUpsertWithWhereUniqueWithoutWorkspaceInput | WorkspaceSecretUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: WorkspaceSecretCreateManyWorkspaceInputEnvelope
    set?: WorkspaceSecretWhereUniqueInput | WorkspaceSecretWhereUniqueInput[]
    disconnect?: WorkspaceSecretWhereUniqueInput | WorkspaceSecretWhereUniqueInput[]
    delete?: WorkspaceSecretWhereUniqueInput | WorkspaceSecretWhereUniqueInput[]
    connect?: WorkspaceSecretWhereUniqueInput | WorkspaceSecretWhereUniqueInput[]
    update?: WorkspaceSecretUpdateWithWhereUniqueWithoutWorkspaceInput | WorkspaceSecretUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: WorkspaceSecretUpdateManyWithWhereWithoutWorkspaceInput | WorkspaceSecretUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: WorkspaceSecretScalarWhereInput | WorkspaceSecretScalarWhereInput[]
  }

  export type WorkspaceSettingsUncheckedUpdateOneWithoutWorkspaceNestedInput = {
    create?: XOR<WorkspaceSettingsCreateWithoutWorkspaceInput, WorkspaceSettingsUncheckedCreateWithoutWorkspaceInput>
    connectOrCreate?: WorkspaceSettingsCreateOrConnectWithoutWorkspaceInput
    upsert?: WorkspaceSettingsUpsertWithoutWorkspaceInput
    disconnect?: WorkspaceSettingsWhereInput | boolean
    delete?: WorkspaceSettingsWhereInput | boolean
    connect?: WorkspaceSettingsWhereUniqueInput
    update?: XOR<XOR<WorkspaceSettingsUpdateToOneWithWhereWithoutWorkspaceInput, WorkspaceSettingsUpdateWithoutWorkspaceInput>, WorkspaceSettingsUncheckedUpdateWithoutWorkspaceInput>
  }

  export type EditorStateUncheckedUpdateOneWithoutWorkspaceNestedInput = {
    create?: XOR<EditorStateCreateWithoutWorkspaceInput, EditorStateUncheckedCreateWithoutWorkspaceInput>
    connectOrCreate?: EditorStateCreateOrConnectWithoutWorkspaceInput
    upsert?: EditorStateUpsertWithoutWorkspaceInput
    disconnect?: EditorStateWhereInput | boolean
    delete?: EditorStateWhereInput | boolean
    connect?: EditorStateWhereUniqueInput
    update?: XOR<XOR<EditorStateUpdateToOneWithWhereWithoutWorkspaceInput, EditorStateUpdateWithoutWorkspaceInput>, EditorStateUncheckedUpdateWithoutWorkspaceInput>
  }

  export type WorkspaceSecretUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<WorkspaceSecretCreateWithoutWorkspaceInput, WorkspaceSecretUncheckedCreateWithoutWorkspaceInput> | WorkspaceSecretCreateWithoutWorkspaceInput[] | WorkspaceSecretUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: WorkspaceSecretCreateOrConnectWithoutWorkspaceInput | WorkspaceSecretCreateOrConnectWithoutWorkspaceInput[]
    upsert?: WorkspaceSecretUpsertWithWhereUniqueWithoutWorkspaceInput | WorkspaceSecretUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: WorkspaceSecretCreateManyWorkspaceInputEnvelope
    set?: WorkspaceSecretWhereUniqueInput | WorkspaceSecretWhereUniqueInput[]
    disconnect?: WorkspaceSecretWhereUniqueInput | WorkspaceSecretWhereUniqueInput[]
    delete?: WorkspaceSecretWhereUniqueInput | WorkspaceSecretWhereUniqueInput[]
    connect?: WorkspaceSecretWhereUniqueInput | WorkspaceSecretWhereUniqueInput[]
    update?: WorkspaceSecretUpdateWithWhereUniqueWithoutWorkspaceInput | WorkspaceSecretUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: WorkspaceSecretUpdateManyWithWhereWithoutWorkspaceInput | WorkspaceSecretUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: WorkspaceSecretScalarWhereInput | WorkspaceSecretScalarWhereInput[]
  }

  export type WorkspaceCreateNestedOneWithoutSecretsInput = {
    create?: XOR<WorkspaceCreateWithoutSecretsInput, WorkspaceUncheckedCreateWithoutSecretsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutSecretsInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type WorkspaceUpdateOneRequiredWithoutSecretsNestedInput = {
    create?: XOR<WorkspaceCreateWithoutSecretsInput, WorkspaceUncheckedCreateWithoutSecretsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutSecretsInput
    upsert?: WorkspaceUpsertWithoutSecretsInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutSecretsInput, WorkspaceUpdateWithoutSecretsInput>, WorkspaceUncheckedUpdateWithoutSecretsInput>
  }

  export type UserCreateNestedOneWithoutSettingsInput = {
    create?: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSettingsInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutSettingsNestedInput = {
    create?: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSettingsInput
    upsert?: UserUpsertWithoutSettingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSettingsInput, UserUpdateWithoutSettingsInput>, UserUncheckedUpdateWithoutSettingsInput>
  }

  export type WorkspaceCreateNestedOneWithoutSettingsInput = {
    create?: XOR<WorkspaceCreateWithoutSettingsInput, WorkspaceUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutSettingsInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type WorkspaceUpdateOneRequiredWithoutSettingsNestedInput = {
    create?: XOR<WorkspaceCreateWithoutSettingsInput, WorkspaceUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutSettingsInput
    upsert?: WorkspaceUpsertWithoutSettingsInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutSettingsInput, WorkspaceUpdateWithoutSettingsInput>, WorkspaceUncheckedUpdateWithoutSettingsInput>
  }

  export type WorkspaceCreateNestedOneWithoutEditorStateInput = {
    create?: XOR<WorkspaceCreateWithoutEditorStateInput, WorkspaceUncheckedCreateWithoutEditorStateInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutEditorStateInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type TabStateCreateNestedManyWithoutEditorStateInput = {
    create?: XOR<TabStateCreateWithoutEditorStateInput, TabStateUncheckedCreateWithoutEditorStateInput> | TabStateCreateWithoutEditorStateInput[] | TabStateUncheckedCreateWithoutEditorStateInput[]
    connectOrCreate?: TabStateCreateOrConnectWithoutEditorStateInput | TabStateCreateOrConnectWithoutEditorStateInput[]
    createMany?: TabStateCreateManyEditorStateInputEnvelope
    connect?: TabStateWhereUniqueInput | TabStateWhereUniqueInput[]
  }

  export type TabStateUncheckedCreateNestedManyWithoutEditorStateInput = {
    create?: XOR<TabStateCreateWithoutEditorStateInput, TabStateUncheckedCreateWithoutEditorStateInput> | TabStateCreateWithoutEditorStateInput[] | TabStateUncheckedCreateWithoutEditorStateInput[]
    connectOrCreate?: TabStateCreateOrConnectWithoutEditorStateInput | TabStateCreateOrConnectWithoutEditorStateInput[]
    createMany?: TabStateCreateManyEditorStateInputEnvelope
    connect?: TabStateWhereUniqueInput | TabStateWhereUniqueInput[]
  }

  export type WorkspaceUpdateOneRequiredWithoutEditorStateNestedInput = {
    create?: XOR<WorkspaceCreateWithoutEditorStateInput, WorkspaceUncheckedCreateWithoutEditorStateInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutEditorStateInput
    upsert?: WorkspaceUpsertWithoutEditorStateInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutEditorStateInput, WorkspaceUpdateWithoutEditorStateInput>, WorkspaceUncheckedUpdateWithoutEditorStateInput>
  }

  export type TabStateUpdateManyWithoutEditorStateNestedInput = {
    create?: XOR<TabStateCreateWithoutEditorStateInput, TabStateUncheckedCreateWithoutEditorStateInput> | TabStateCreateWithoutEditorStateInput[] | TabStateUncheckedCreateWithoutEditorStateInput[]
    connectOrCreate?: TabStateCreateOrConnectWithoutEditorStateInput | TabStateCreateOrConnectWithoutEditorStateInput[]
    upsert?: TabStateUpsertWithWhereUniqueWithoutEditorStateInput | TabStateUpsertWithWhereUniqueWithoutEditorStateInput[]
    createMany?: TabStateCreateManyEditorStateInputEnvelope
    set?: TabStateWhereUniqueInput | TabStateWhereUniqueInput[]
    disconnect?: TabStateWhereUniqueInput | TabStateWhereUniqueInput[]
    delete?: TabStateWhereUniqueInput | TabStateWhereUniqueInput[]
    connect?: TabStateWhereUniqueInput | TabStateWhereUniqueInput[]
    update?: TabStateUpdateWithWhereUniqueWithoutEditorStateInput | TabStateUpdateWithWhereUniqueWithoutEditorStateInput[]
    updateMany?: TabStateUpdateManyWithWhereWithoutEditorStateInput | TabStateUpdateManyWithWhereWithoutEditorStateInput[]
    deleteMany?: TabStateScalarWhereInput | TabStateScalarWhereInput[]
  }

  export type TabStateUncheckedUpdateManyWithoutEditorStateNestedInput = {
    create?: XOR<TabStateCreateWithoutEditorStateInput, TabStateUncheckedCreateWithoutEditorStateInput> | TabStateCreateWithoutEditorStateInput[] | TabStateUncheckedCreateWithoutEditorStateInput[]
    connectOrCreate?: TabStateCreateOrConnectWithoutEditorStateInput | TabStateCreateOrConnectWithoutEditorStateInput[]
    upsert?: TabStateUpsertWithWhereUniqueWithoutEditorStateInput | TabStateUpsertWithWhereUniqueWithoutEditorStateInput[]
    createMany?: TabStateCreateManyEditorStateInputEnvelope
    set?: TabStateWhereUniqueInput | TabStateWhereUniqueInput[]
    disconnect?: TabStateWhereUniqueInput | TabStateWhereUniqueInput[]
    delete?: TabStateWhereUniqueInput | TabStateWhereUniqueInput[]
    connect?: TabStateWhereUniqueInput | TabStateWhereUniqueInput[]
    update?: TabStateUpdateWithWhereUniqueWithoutEditorStateInput | TabStateUpdateWithWhereUniqueWithoutEditorStateInput[]
    updateMany?: TabStateUpdateManyWithWhereWithoutEditorStateInput | TabStateUpdateManyWithWhereWithoutEditorStateInput[]
    deleteMany?: TabStateScalarWhereInput | TabStateScalarWhereInput[]
  }

  export type EditorStateCreateNestedOneWithoutTabsInput = {
    create?: XOR<EditorStateCreateWithoutTabsInput, EditorStateUncheckedCreateWithoutTabsInput>
    connectOrCreate?: EditorStateCreateOrConnectWithoutTabsInput
    connect?: EditorStateWhereUniqueInput
  }

  export type EditorStateUpdateOneRequiredWithoutTabsNestedInput = {
    create?: XOR<EditorStateCreateWithoutTabsInput, EditorStateUncheckedCreateWithoutTabsInput>
    connectOrCreate?: EditorStateCreateOrConnectWithoutTabsInput
    upsert?: EditorStateUpsertWithoutTabsInput
    connect?: EditorStateWhereUniqueInput
    update?: XOR<XOR<EditorStateUpdateToOneWithWhereWithoutTabsInput, EditorStateUpdateWithoutTabsInput>, EditorStateUncheckedUpdateWithoutTabsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type WorkspaceCreateWithoutOwnerInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: WorkspaceSettingsCreateNestedOneWithoutWorkspaceInput
    editorState?: EditorStateCreateNestedOneWithoutWorkspaceInput
    secrets?: WorkspaceSecretCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutOwnerInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: WorkspaceSettingsUncheckedCreateNestedOneWithoutWorkspaceInput
    editorState?: EditorStateUncheckedCreateNestedOneWithoutWorkspaceInput
    secrets?: WorkspaceSecretUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutOwnerInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutOwnerInput, WorkspaceUncheckedCreateWithoutOwnerInput>
  }

  export type WorkspaceCreateManyOwnerInputEnvelope = {
    data: WorkspaceCreateManyOwnerInput | WorkspaceCreateManyOwnerInput[]
  }

  export type UserSettingsCreateWithoutUserInput = {
    id?: string
    theme?: string
    fontSize?: number
    fontFamily?: string
    lineHeight?: number
    tabSize?: number
    useSpaces?: boolean
    autoFormat?: boolean
    formatOnSave?: boolean
    autoSave?: boolean
    autoSaveDelay?: number
    wordWrap?: boolean
    minimap?: boolean
    lineNumbers?: boolean
  }

  export type UserSettingsUncheckedCreateWithoutUserInput = {
    id?: string
    theme?: string
    fontSize?: number
    fontFamily?: string
    lineHeight?: number
    tabSize?: number
    useSpaces?: boolean
    autoFormat?: boolean
    formatOnSave?: boolean
    autoSave?: boolean
    autoSaveDelay?: number
    wordWrap?: boolean
    minimap?: boolean
    lineNumbers?: boolean
  }

  export type UserSettingsCreateOrConnectWithoutUserInput = {
    where: UserSettingsWhereUniqueInput
    create: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
  }

  export type ExtensionCreateWithoutAuthorInput = {
    id?: string
    name: string
    description?: string | null
    gitUrl?: string | null
    gitBranch?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    active?: boolean
    installedVersionId?: string | null
    versions?: ExtensionVersionCreateNestedManyWithoutExtensionInput
    installations?: UserExtensionCreateNestedManyWithoutExtensionInput
  }

  export type ExtensionUncheckedCreateWithoutAuthorInput = {
    id?: string
    name: string
    description?: string | null
    gitUrl?: string | null
    gitBranch?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    active?: boolean
    installedVersionId?: string | null
    versions?: ExtensionVersionUncheckedCreateNestedManyWithoutExtensionInput
    installations?: UserExtensionUncheckedCreateNestedManyWithoutExtensionInput
  }

  export type ExtensionCreateOrConnectWithoutAuthorInput = {
    where: ExtensionWhereUniqueInput
    create: XOR<ExtensionCreateWithoutAuthorInput, ExtensionUncheckedCreateWithoutAuthorInput>
  }

  export type ExtensionCreateManyAuthorInputEnvelope = {
    data: ExtensionCreateManyAuthorInput | ExtensionCreateManyAuthorInput[]
  }

  export type UserExtensionCreateWithoutUserInput = {
    id?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    extension: ExtensionCreateNestedOneWithoutInstallationsInput
    installedVersion: ExtensionVersionCreateNestedOneWithoutInstallationsInput
  }

  export type UserExtensionUncheckedCreateWithoutUserInput = {
    id?: string
    extensionId: string
    installedVersionId: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserExtensionCreateOrConnectWithoutUserInput = {
    where: UserExtensionWhereUniqueInput
    create: XOR<UserExtensionCreateWithoutUserInput, UserExtensionUncheckedCreateWithoutUserInput>
  }

  export type UserExtensionCreateManyUserInputEnvelope = {
    data: UserExtensionCreateManyUserInput | UserExtensionCreateManyUserInput[]
  }

  export type WorkspaceUpsertWithWhereUniqueWithoutOwnerInput = {
    where: WorkspaceWhereUniqueInput
    update: XOR<WorkspaceUpdateWithoutOwnerInput, WorkspaceUncheckedUpdateWithoutOwnerInput>
    create: XOR<WorkspaceCreateWithoutOwnerInput, WorkspaceUncheckedCreateWithoutOwnerInput>
  }

  export type WorkspaceUpdateWithWhereUniqueWithoutOwnerInput = {
    where: WorkspaceWhereUniqueInput
    data: XOR<WorkspaceUpdateWithoutOwnerInput, WorkspaceUncheckedUpdateWithoutOwnerInput>
  }

  export type WorkspaceUpdateManyWithWhereWithoutOwnerInput = {
    where: WorkspaceScalarWhereInput
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyWithoutOwnerInput>
  }

  export type WorkspaceScalarWhereInput = {
    AND?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
    OR?: WorkspaceScalarWhereInput[]
    NOT?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
    id?: StringFilter<"Workspace"> | string
    name?: StringFilter<"Workspace"> | string
    description?: StringNullableFilter<"Workspace"> | string | null
    ownerId?: StringFilter<"Workspace"> | string
    isPublic?: BoolFilter<"Workspace"> | boolean
    createdAt?: DateTimeFilter<"Workspace"> | Date | string
    updatedAt?: DateTimeFilter<"Workspace"> | Date | string
  }

  export type UserSettingsUpsertWithoutUserInput = {
    update: XOR<UserSettingsUpdateWithoutUserInput, UserSettingsUncheckedUpdateWithoutUserInput>
    create: XOR<UserSettingsCreateWithoutUserInput, UserSettingsUncheckedCreateWithoutUserInput>
    where?: UserSettingsWhereInput
  }

  export type UserSettingsUpdateToOneWithWhereWithoutUserInput = {
    where?: UserSettingsWhereInput
    data: XOR<UserSettingsUpdateWithoutUserInput, UserSettingsUncheckedUpdateWithoutUserInput>
  }

  export type UserSettingsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    fontSize?: IntFieldUpdateOperationsInput | number
    fontFamily?: StringFieldUpdateOperationsInput | string
    lineHeight?: FloatFieldUpdateOperationsInput | number
    tabSize?: IntFieldUpdateOperationsInput | number
    useSpaces?: BoolFieldUpdateOperationsInput | boolean
    autoFormat?: BoolFieldUpdateOperationsInput | boolean
    formatOnSave?: BoolFieldUpdateOperationsInput | boolean
    autoSave?: BoolFieldUpdateOperationsInput | boolean
    autoSaveDelay?: IntFieldUpdateOperationsInput | number
    wordWrap?: BoolFieldUpdateOperationsInput | boolean
    minimap?: BoolFieldUpdateOperationsInput | boolean
    lineNumbers?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserSettingsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    theme?: StringFieldUpdateOperationsInput | string
    fontSize?: IntFieldUpdateOperationsInput | number
    fontFamily?: StringFieldUpdateOperationsInput | string
    lineHeight?: FloatFieldUpdateOperationsInput | number
    tabSize?: IntFieldUpdateOperationsInput | number
    useSpaces?: BoolFieldUpdateOperationsInput | boolean
    autoFormat?: BoolFieldUpdateOperationsInput | boolean
    formatOnSave?: BoolFieldUpdateOperationsInput | boolean
    autoSave?: BoolFieldUpdateOperationsInput | boolean
    autoSaveDelay?: IntFieldUpdateOperationsInput | number
    wordWrap?: BoolFieldUpdateOperationsInput | boolean
    minimap?: BoolFieldUpdateOperationsInput | boolean
    lineNumbers?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ExtensionUpsertWithWhereUniqueWithoutAuthorInput = {
    where: ExtensionWhereUniqueInput
    update: XOR<ExtensionUpdateWithoutAuthorInput, ExtensionUncheckedUpdateWithoutAuthorInput>
    create: XOR<ExtensionCreateWithoutAuthorInput, ExtensionUncheckedCreateWithoutAuthorInput>
  }

  export type ExtensionUpdateWithWhereUniqueWithoutAuthorInput = {
    where: ExtensionWhereUniqueInput
    data: XOR<ExtensionUpdateWithoutAuthorInput, ExtensionUncheckedUpdateWithoutAuthorInput>
  }

  export type ExtensionUpdateManyWithWhereWithoutAuthorInput = {
    where: ExtensionScalarWhereInput
    data: XOR<ExtensionUpdateManyMutationInput, ExtensionUncheckedUpdateManyWithoutAuthorInput>
  }

  export type ExtensionScalarWhereInput = {
    AND?: ExtensionScalarWhereInput | ExtensionScalarWhereInput[]
    OR?: ExtensionScalarWhereInput[]
    NOT?: ExtensionScalarWhereInput | ExtensionScalarWhereInput[]
    id?: StringFilter<"Extension"> | string
    name?: StringFilter<"Extension"> | string
    description?: StringNullableFilter<"Extension"> | string | null
    authorId?: StringFilter<"Extension"> | string
    gitUrl?: StringNullableFilter<"Extension"> | string | null
    gitBranch?: StringNullableFilter<"Extension"> | string | null
    createdAt?: DateTimeFilter<"Extension"> | Date | string
    updatedAt?: DateTimeFilter<"Extension"> | Date | string
    active?: BoolFilter<"Extension"> | boolean
    installedVersionId?: StringNullableFilter<"Extension"> | string | null
  }

  export type UserExtensionUpsertWithWhereUniqueWithoutUserInput = {
    where: UserExtensionWhereUniqueInput
    update: XOR<UserExtensionUpdateWithoutUserInput, UserExtensionUncheckedUpdateWithoutUserInput>
    create: XOR<UserExtensionCreateWithoutUserInput, UserExtensionUncheckedCreateWithoutUserInput>
  }

  export type UserExtensionUpdateWithWhereUniqueWithoutUserInput = {
    where: UserExtensionWhereUniqueInput
    data: XOR<UserExtensionUpdateWithoutUserInput, UserExtensionUncheckedUpdateWithoutUserInput>
  }

  export type UserExtensionUpdateManyWithWhereWithoutUserInput = {
    where: UserExtensionScalarWhereInput
    data: XOR<UserExtensionUpdateManyMutationInput, UserExtensionUncheckedUpdateManyWithoutUserInput>
  }

  export type UserExtensionScalarWhereInput = {
    AND?: UserExtensionScalarWhereInput | UserExtensionScalarWhereInput[]
    OR?: UserExtensionScalarWhereInput[]
    NOT?: UserExtensionScalarWhereInput | UserExtensionScalarWhereInput[]
    id?: StringFilter<"UserExtension"> | string
    userId?: StringFilter<"UserExtension"> | string
    extensionId?: StringFilter<"UserExtension"> | string
    installedVersionId?: StringFilter<"UserExtension"> | string
    active?: BoolFilter<"UserExtension"> | boolean
    createdAt?: DateTimeFilter<"UserExtension"> | Date | string
    updatedAt?: DateTimeFilter<"UserExtension"> | Date | string
  }

  export type UserCreateWithoutExtensionsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLogin?: Date | string | null
    bio?: string | null
    createdAt?: Date | string
    workspaces?: WorkspaceCreateNestedManyWithoutOwnerInput
    settings?: UserSettingsCreateNestedOneWithoutUserInput
    userExtensions?: UserExtensionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutExtensionsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLogin?: Date | string | null
    bio?: string | null
    createdAt?: Date | string
    workspaces?: WorkspaceUncheckedCreateNestedManyWithoutOwnerInput
    settings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
    userExtensions?: UserExtensionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutExtensionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutExtensionsInput, UserUncheckedCreateWithoutExtensionsInput>
  }

  export type ExtensionVersionCreateWithoutExtensionInput = {
    id?: string
    version: string
    gitUrl: string
    gitBranch?: string
    status?: string
    buildLogs?: string
    entryPointUrl?: string | null
    createdAt?: Date | string
    installations?: UserExtensionCreateNestedManyWithoutInstalledVersionInput
  }

  export type ExtensionVersionUncheckedCreateWithoutExtensionInput = {
    id?: string
    version: string
    gitUrl: string
    gitBranch?: string
    status?: string
    buildLogs?: string
    entryPointUrl?: string | null
    createdAt?: Date | string
    installations?: UserExtensionUncheckedCreateNestedManyWithoutInstalledVersionInput
  }

  export type ExtensionVersionCreateOrConnectWithoutExtensionInput = {
    where: ExtensionVersionWhereUniqueInput
    create: XOR<ExtensionVersionCreateWithoutExtensionInput, ExtensionVersionUncheckedCreateWithoutExtensionInput>
  }

  export type ExtensionVersionCreateManyExtensionInputEnvelope = {
    data: ExtensionVersionCreateManyExtensionInput | ExtensionVersionCreateManyExtensionInput[]
  }

  export type UserExtensionCreateWithoutExtensionInput = {
    id?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUserExtensionsInput
    installedVersion: ExtensionVersionCreateNestedOneWithoutInstallationsInput
  }

  export type UserExtensionUncheckedCreateWithoutExtensionInput = {
    id?: string
    userId: string
    installedVersionId: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserExtensionCreateOrConnectWithoutExtensionInput = {
    where: UserExtensionWhereUniqueInput
    create: XOR<UserExtensionCreateWithoutExtensionInput, UserExtensionUncheckedCreateWithoutExtensionInput>
  }

  export type UserExtensionCreateManyExtensionInputEnvelope = {
    data: UserExtensionCreateManyExtensionInput | UserExtensionCreateManyExtensionInput[]
  }

  export type UserUpsertWithoutExtensionsInput = {
    update: XOR<UserUpdateWithoutExtensionsInput, UserUncheckedUpdateWithoutExtensionsInput>
    create: XOR<UserCreateWithoutExtensionsInput, UserUncheckedCreateWithoutExtensionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutExtensionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutExtensionsInput, UserUncheckedUpdateWithoutExtensionsInput>
  }

  export type UserUpdateWithoutExtensionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspaces?: WorkspaceUpdateManyWithoutOwnerNestedInput
    settings?: UserSettingsUpdateOneWithoutUserNestedInput
    userExtensions?: UserExtensionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutExtensionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspaces?: WorkspaceUncheckedUpdateManyWithoutOwnerNestedInput
    settings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
    userExtensions?: UserExtensionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ExtensionVersionUpsertWithWhereUniqueWithoutExtensionInput = {
    where: ExtensionVersionWhereUniqueInput
    update: XOR<ExtensionVersionUpdateWithoutExtensionInput, ExtensionVersionUncheckedUpdateWithoutExtensionInput>
    create: XOR<ExtensionVersionCreateWithoutExtensionInput, ExtensionVersionUncheckedCreateWithoutExtensionInput>
  }

  export type ExtensionVersionUpdateWithWhereUniqueWithoutExtensionInput = {
    where: ExtensionVersionWhereUniqueInput
    data: XOR<ExtensionVersionUpdateWithoutExtensionInput, ExtensionVersionUncheckedUpdateWithoutExtensionInput>
  }

  export type ExtensionVersionUpdateManyWithWhereWithoutExtensionInput = {
    where: ExtensionVersionScalarWhereInput
    data: XOR<ExtensionVersionUpdateManyMutationInput, ExtensionVersionUncheckedUpdateManyWithoutExtensionInput>
  }

  export type ExtensionVersionScalarWhereInput = {
    AND?: ExtensionVersionScalarWhereInput | ExtensionVersionScalarWhereInput[]
    OR?: ExtensionVersionScalarWhereInput[]
    NOT?: ExtensionVersionScalarWhereInput | ExtensionVersionScalarWhereInput[]
    id?: StringFilter<"ExtensionVersion"> | string
    extensionId?: StringFilter<"ExtensionVersion"> | string
    version?: StringFilter<"ExtensionVersion"> | string
    gitUrl?: StringFilter<"ExtensionVersion"> | string
    gitBranch?: StringFilter<"ExtensionVersion"> | string
    status?: StringFilter<"ExtensionVersion"> | string
    buildLogs?: StringFilter<"ExtensionVersion"> | string
    entryPointUrl?: StringNullableFilter<"ExtensionVersion"> | string | null
    createdAt?: DateTimeFilter<"ExtensionVersion"> | Date | string
  }

  export type UserExtensionUpsertWithWhereUniqueWithoutExtensionInput = {
    where: UserExtensionWhereUniqueInput
    update: XOR<UserExtensionUpdateWithoutExtensionInput, UserExtensionUncheckedUpdateWithoutExtensionInput>
    create: XOR<UserExtensionCreateWithoutExtensionInput, UserExtensionUncheckedCreateWithoutExtensionInput>
  }

  export type UserExtensionUpdateWithWhereUniqueWithoutExtensionInput = {
    where: UserExtensionWhereUniqueInput
    data: XOR<UserExtensionUpdateWithoutExtensionInput, UserExtensionUncheckedUpdateWithoutExtensionInput>
  }

  export type UserExtensionUpdateManyWithWhereWithoutExtensionInput = {
    where: UserExtensionScalarWhereInput
    data: XOR<UserExtensionUpdateManyMutationInput, UserExtensionUncheckedUpdateManyWithoutExtensionInput>
  }

  export type ExtensionCreateWithoutVersionsInput = {
    id?: string
    name: string
    description?: string | null
    gitUrl?: string | null
    gitBranch?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    active?: boolean
    installedVersionId?: string | null
    author: UserCreateNestedOneWithoutExtensionsInput
    installations?: UserExtensionCreateNestedManyWithoutExtensionInput
  }

  export type ExtensionUncheckedCreateWithoutVersionsInput = {
    id?: string
    name: string
    description?: string | null
    authorId: string
    gitUrl?: string | null
    gitBranch?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    active?: boolean
    installedVersionId?: string | null
    installations?: UserExtensionUncheckedCreateNestedManyWithoutExtensionInput
  }

  export type ExtensionCreateOrConnectWithoutVersionsInput = {
    where: ExtensionWhereUniqueInput
    create: XOR<ExtensionCreateWithoutVersionsInput, ExtensionUncheckedCreateWithoutVersionsInput>
  }

  export type UserExtensionCreateWithoutInstalledVersionInput = {
    id?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUserExtensionsInput
    extension: ExtensionCreateNestedOneWithoutInstallationsInput
  }

  export type UserExtensionUncheckedCreateWithoutInstalledVersionInput = {
    id?: string
    userId: string
    extensionId: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserExtensionCreateOrConnectWithoutInstalledVersionInput = {
    where: UserExtensionWhereUniqueInput
    create: XOR<UserExtensionCreateWithoutInstalledVersionInput, UserExtensionUncheckedCreateWithoutInstalledVersionInput>
  }

  export type UserExtensionCreateManyInstalledVersionInputEnvelope = {
    data: UserExtensionCreateManyInstalledVersionInput | UserExtensionCreateManyInstalledVersionInput[]
  }

  export type ExtensionUpsertWithoutVersionsInput = {
    update: XOR<ExtensionUpdateWithoutVersionsInput, ExtensionUncheckedUpdateWithoutVersionsInput>
    create: XOR<ExtensionCreateWithoutVersionsInput, ExtensionUncheckedCreateWithoutVersionsInput>
    where?: ExtensionWhereInput
  }

  export type ExtensionUpdateToOneWithWhereWithoutVersionsInput = {
    where?: ExtensionWhereInput
    data: XOR<ExtensionUpdateWithoutVersionsInput, ExtensionUncheckedUpdateWithoutVersionsInput>
  }

  export type ExtensionUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    gitUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gitBranch?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    installedVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    author?: UserUpdateOneRequiredWithoutExtensionsNestedInput
    installations?: UserExtensionUpdateManyWithoutExtensionNestedInput
  }

  export type ExtensionUncheckedUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    gitUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gitBranch?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    installedVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    installations?: UserExtensionUncheckedUpdateManyWithoutExtensionNestedInput
  }

  export type UserExtensionUpsertWithWhereUniqueWithoutInstalledVersionInput = {
    where: UserExtensionWhereUniqueInput
    update: XOR<UserExtensionUpdateWithoutInstalledVersionInput, UserExtensionUncheckedUpdateWithoutInstalledVersionInput>
    create: XOR<UserExtensionCreateWithoutInstalledVersionInput, UserExtensionUncheckedCreateWithoutInstalledVersionInput>
  }

  export type UserExtensionUpdateWithWhereUniqueWithoutInstalledVersionInput = {
    where: UserExtensionWhereUniqueInput
    data: XOR<UserExtensionUpdateWithoutInstalledVersionInput, UserExtensionUncheckedUpdateWithoutInstalledVersionInput>
  }

  export type UserExtensionUpdateManyWithWhereWithoutInstalledVersionInput = {
    where: UserExtensionScalarWhereInput
    data: XOR<UserExtensionUpdateManyMutationInput, UserExtensionUncheckedUpdateManyWithoutInstalledVersionInput>
  }

  export type UserCreateWithoutUserExtensionsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLogin?: Date | string | null
    bio?: string | null
    createdAt?: Date | string
    workspaces?: WorkspaceCreateNestedManyWithoutOwnerInput
    settings?: UserSettingsCreateNestedOneWithoutUserInput
    extensions?: ExtensionCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutUserExtensionsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLogin?: Date | string | null
    bio?: string | null
    createdAt?: Date | string
    workspaces?: WorkspaceUncheckedCreateNestedManyWithoutOwnerInput
    settings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
    extensions?: ExtensionUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutUserExtensionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserExtensionsInput, UserUncheckedCreateWithoutUserExtensionsInput>
  }

  export type ExtensionCreateWithoutInstallationsInput = {
    id?: string
    name: string
    description?: string | null
    gitUrl?: string | null
    gitBranch?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    active?: boolean
    installedVersionId?: string | null
    author: UserCreateNestedOneWithoutExtensionsInput
    versions?: ExtensionVersionCreateNestedManyWithoutExtensionInput
  }

  export type ExtensionUncheckedCreateWithoutInstallationsInput = {
    id?: string
    name: string
    description?: string | null
    authorId: string
    gitUrl?: string | null
    gitBranch?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    active?: boolean
    installedVersionId?: string | null
    versions?: ExtensionVersionUncheckedCreateNestedManyWithoutExtensionInput
  }

  export type ExtensionCreateOrConnectWithoutInstallationsInput = {
    where: ExtensionWhereUniqueInput
    create: XOR<ExtensionCreateWithoutInstallationsInput, ExtensionUncheckedCreateWithoutInstallationsInput>
  }

  export type ExtensionVersionCreateWithoutInstallationsInput = {
    id?: string
    version: string
    gitUrl: string
    gitBranch?: string
    status?: string
    buildLogs?: string
    entryPointUrl?: string | null
    createdAt?: Date | string
    extension: ExtensionCreateNestedOneWithoutVersionsInput
  }

  export type ExtensionVersionUncheckedCreateWithoutInstallationsInput = {
    id?: string
    extensionId: string
    version: string
    gitUrl: string
    gitBranch?: string
    status?: string
    buildLogs?: string
    entryPointUrl?: string | null
    createdAt?: Date | string
  }

  export type ExtensionVersionCreateOrConnectWithoutInstallationsInput = {
    where: ExtensionVersionWhereUniqueInput
    create: XOR<ExtensionVersionCreateWithoutInstallationsInput, ExtensionVersionUncheckedCreateWithoutInstallationsInput>
  }

  export type UserUpsertWithoutUserExtensionsInput = {
    update: XOR<UserUpdateWithoutUserExtensionsInput, UserUncheckedUpdateWithoutUserExtensionsInput>
    create: XOR<UserCreateWithoutUserExtensionsInput, UserUncheckedCreateWithoutUserExtensionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserExtensionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserExtensionsInput, UserUncheckedUpdateWithoutUserExtensionsInput>
  }

  export type UserUpdateWithoutUserExtensionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspaces?: WorkspaceUpdateManyWithoutOwnerNestedInput
    settings?: UserSettingsUpdateOneWithoutUserNestedInput
    extensions?: ExtensionUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutUserExtensionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspaces?: WorkspaceUncheckedUpdateManyWithoutOwnerNestedInput
    settings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
    extensions?: ExtensionUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type ExtensionUpsertWithoutInstallationsInput = {
    update: XOR<ExtensionUpdateWithoutInstallationsInput, ExtensionUncheckedUpdateWithoutInstallationsInput>
    create: XOR<ExtensionCreateWithoutInstallationsInput, ExtensionUncheckedCreateWithoutInstallationsInput>
    where?: ExtensionWhereInput
  }

  export type ExtensionUpdateToOneWithWhereWithoutInstallationsInput = {
    where?: ExtensionWhereInput
    data: XOR<ExtensionUpdateWithoutInstallationsInput, ExtensionUncheckedUpdateWithoutInstallationsInput>
  }

  export type ExtensionUpdateWithoutInstallationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    gitUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gitBranch?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    installedVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    author?: UserUpdateOneRequiredWithoutExtensionsNestedInput
    versions?: ExtensionVersionUpdateManyWithoutExtensionNestedInput
  }

  export type ExtensionUncheckedUpdateWithoutInstallationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    gitUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gitBranch?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    installedVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    versions?: ExtensionVersionUncheckedUpdateManyWithoutExtensionNestedInput
  }

  export type ExtensionVersionUpsertWithoutInstallationsInput = {
    update: XOR<ExtensionVersionUpdateWithoutInstallationsInput, ExtensionVersionUncheckedUpdateWithoutInstallationsInput>
    create: XOR<ExtensionVersionCreateWithoutInstallationsInput, ExtensionVersionUncheckedCreateWithoutInstallationsInput>
    where?: ExtensionVersionWhereInput
  }

  export type ExtensionVersionUpdateToOneWithWhereWithoutInstallationsInput = {
    where?: ExtensionVersionWhereInput
    data: XOR<ExtensionVersionUpdateWithoutInstallationsInput, ExtensionVersionUncheckedUpdateWithoutInstallationsInput>
  }

  export type ExtensionVersionUpdateWithoutInstallationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    gitUrl?: StringFieldUpdateOperationsInput | string
    gitBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    buildLogs?: StringFieldUpdateOperationsInput | string
    entryPointUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    extension?: ExtensionUpdateOneRequiredWithoutVersionsNestedInput
  }

  export type ExtensionVersionUncheckedUpdateWithoutInstallationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    extensionId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    gitUrl?: StringFieldUpdateOperationsInput | string
    gitBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    buildLogs?: StringFieldUpdateOperationsInput | string
    entryPointUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutWorkspacesInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLogin?: Date | string | null
    bio?: string | null
    createdAt?: Date | string
    settings?: UserSettingsCreateNestedOneWithoutUserInput
    extensions?: ExtensionCreateNestedManyWithoutAuthorInput
    userExtensions?: UserExtensionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWorkspacesInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLogin?: Date | string | null
    bio?: string | null
    createdAt?: Date | string
    settings?: UserSettingsUncheckedCreateNestedOneWithoutUserInput
    extensions?: ExtensionUncheckedCreateNestedManyWithoutAuthorInput
    userExtensions?: UserExtensionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWorkspacesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput>
  }

  export type WorkspaceSettingsCreateWithoutWorkspaceInput = {
    settings: string
  }

  export type WorkspaceSettingsUncheckedCreateWithoutWorkspaceInput = {
    settings: string
  }

  export type WorkspaceSettingsCreateOrConnectWithoutWorkspaceInput = {
    where: WorkspaceSettingsWhereUniqueInput
    create: XOR<WorkspaceSettingsCreateWithoutWorkspaceInput, WorkspaceSettingsUncheckedCreateWithoutWorkspaceInput>
  }

  export type EditorStateCreateWithoutWorkspaceInput = {
    activeTabId?: string | null
    lastSaved?: Date | string | null
    tabs?: TabStateCreateNestedManyWithoutEditorStateInput
  }

  export type EditorStateUncheckedCreateWithoutWorkspaceInput = {
    activeTabId?: string | null
    lastSaved?: Date | string | null
    tabs?: TabStateUncheckedCreateNestedManyWithoutEditorStateInput
  }

  export type EditorStateCreateOrConnectWithoutWorkspaceInput = {
    where: EditorStateWhereUniqueInput
    create: XOR<EditorStateCreateWithoutWorkspaceInput, EditorStateUncheckedCreateWithoutWorkspaceInput>
  }

  export type WorkspaceSecretCreateWithoutWorkspaceInput = {
    id?: string
    key: string
    value: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceSecretUncheckedCreateWithoutWorkspaceInput = {
    id?: string
    key: string
    value: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceSecretCreateOrConnectWithoutWorkspaceInput = {
    where: WorkspaceSecretWhereUniqueInput
    create: XOR<WorkspaceSecretCreateWithoutWorkspaceInput, WorkspaceSecretUncheckedCreateWithoutWorkspaceInput>
  }

  export type WorkspaceSecretCreateManyWorkspaceInputEnvelope = {
    data: WorkspaceSecretCreateManyWorkspaceInput | WorkspaceSecretCreateManyWorkspaceInput[]
  }

  export type UserUpsertWithoutWorkspacesInput = {
    update: XOR<UserUpdateWithoutWorkspacesInput, UserUncheckedUpdateWithoutWorkspacesInput>
    create: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWorkspacesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWorkspacesInput, UserUncheckedUpdateWithoutWorkspacesInput>
  }

  export type UserUpdateWithoutWorkspacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: UserSettingsUpdateOneWithoutUserNestedInput
    extensions?: ExtensionUpdateManyWithoutAuthorNestedInput
    userExtensions?: UserExtensionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWorkspacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: UserSettingsUncheckedUpdateOneWithoutUserNestedInput
    extensions?: ExtensionUncheckedUpdateManyWithoutAuthorNestedInput
    userExtensions?: UserExtensionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type WorkspaceSettingsUpsertWithoutWorkspaceInput = {
    update: XOR<WorkspaceSettingsUpdateWithoutWorkspaceInput, WorkspaceSettingsUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<WorkspaceSettingsCreateWithoutWorkspaceInput, WorkspaceSettingsUncheckedCreateWithoutWorkspaceInput>
    where?: WorkspaceSettingsWhereInput
  }

  export type WorkspaceSettingsUpdateToOneWithWhereWithoutWorkspaceInput = {
    where?: WorkspaceSettingsWhereInput
    data: XOR<WorkspaceSettingsUpdateWithoutWorkspaceInput, WorkspaceSettingsUncheckedUpdateWithoutWorkspaceInput>
  }

  export type WorkspaceSettingsUpdateWithoutWorkspaceInput = {
    settings?: StringFieldUpdateOperationsInput | string
  }

  export type WorkspaceSettingsUncheckedUpdateWithoutWorkspaceInput = {
    settings?: StringFieldUpdateOperationsInput | string
  }

  export type EditorStateUpsertWithoutWorkspaceInput = {
    update: XOR<EditorStateUpdateWithoutWorkspaceInput, EditorStateUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<EditorStateCreateWithoutWorkspaceInput, EditorStateUncheckedCreateWithoutWorkspaceInput>
    where?: EditorStateWhereInput
  }

  export type EditorStateUpdateToOneWithWhereWithoutWorkspaceInput = {
    where?: EditorStateWhereInput
    data: XOR<EditorStateUpdateWithoutWorkspaceInput, EditorStateUncheckedUpdateWithoutWorkspaceInput>
  }

  export type EditorStateUpdateWithoutWorkspaceInput = {
    activeTabId?: NullableStringFieldUpdateOperationsInput | string | null
    lastSaved?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tabs?: TabStateUpdateManyWithoutEditorStateNestedInput
  }

  export type EditorStateUncheckedUpdateWithoutWorkspaceInput = {
    activeTabId?: NullableStringFieldUpdateOperationsInput | string | null
    lastSaved?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tabs?: TabStateUncheckedUpdateManyWithoutEditorStateNestedInput
  }

  export type WorkspaceSecretUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: WorkspaceSecretWhereUniqueInput
    update: XOR<WorkspaceSecretUpdateWithoutWorkspaceInput, WorkspaceSecretUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<WorkspaceSecretCreateWithoutWorkspaceInput, WorkspaceSecretUncheckedCreateWithoutWorkspaceInput>
  }

  export type WorkspaceSecretUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: WorkspaceSecretWhereUniqueInput
    data: XOR<WorkspaceSecretUpdateWithoutWorkspaceInput, WorkspaceSecretUncheckedUpdateWithoutWorkspaceInput>
  }

  export type WorkspaceSecretUpdateManyWithWhereWithoutWorkspaceInput = {
    where: WorkspaceSecretScalarWhereInput
    data: XOR<WorkspaceSecretUpdateManyMutationInput, WorkspaceSecretUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type WorkspaceSecretScalarWhereInput = {
    AND?: WorkspaceSecretScalarWhereInput | WorkspaceSecretScalarWhereInput[]
    OR?: WorkspaceSecretScalarWhereInput[]
    NOT?: WorkspaceSecretScalarWhereInput | WorkspaceSecretScalarWhereInput[]
    id?: StringFilter<"WorkspaceSecret"> | string
    workspaceId?: StringFilter<"WorkspaceSecret"> | string
    key?: StringFilter<"WorkspaceSecret"> | string
    value?: StringFilter<"WorkspaceSecret"> | string
    createdAt?: DateTimeFilter<"WorkspaceSecret"> | Date | string
    updatedAt?: DateTimeFilter<"WorkspaceSecret"> | Date | string
  }

  export type WorkspaceCreateWithoutSecretsInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutWorkspacesInput
    settings?: WorkspaceSettingsCreateNestedOneWithoutWorkspaceInput
    editorState?: EditorStateCreateNestedOneWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutSecretsInput = {
    id?: string
    name: string
    description?: string | null
    ownerId: string
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: WorkspaceSettingsUncheckedCreateNestedOneWithoutWorkspaceInput
    editorState?: EditorStateUncheckedCreateNestedOneWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutSecretsInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutSecretsInput, WorkspaceUncheckedCreateWithoutSecretsInput>
  }

  export type WorkspaceUpsertWithoutSecretsInput = {
    update: XOR<WorkspaceUpdateWithoutSecretsInput, WorkspaceUncheckedUpdateWithoutSecretsInput>
    create: XOR<WorkspaceCreateWithoutSecretsInput, WorkspaceUncheckedCreateWithoutSecretsInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutSecretsInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutSecretsInput, WorkspaceUncheckedUpdateWithoutSecretsInput>
  }

  export type WorkspaceUpdateWithoutSecretsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutWorkspacesNestedInput
    settings?: WorkspaceSettingsUpdateOneWithoutWorkspaceNestedInput
    editorState?: EditorStateUpdateOneWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutSecretsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: WorkspaceSettingsUncheckedUpdateOneWithoutWorkspaceNestedInput
    editorState?: EditorStateUncheckedUpdateOneWithoutWorkspaceNestedInput
  }

  export type UserCreateWithoutSettingsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLogin?: Date | string | null
    bio?: string | null
    createdAt?: Date | string
    workspaces?: WorkspaceCreateNestedManyWithoutOwnerInput
    extensions?: ExtensionCreateNestedManyWithoutAuthorInput
    userExtensions?: UserExtensionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSettingsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    role?: string
    isActive?: boolean
    lastLogin?: Date | string | null
    bio?: string | null
    createdAt?: Date | string
    workspaces?: WorkspaceUncheckedCreateNestedManyWithoutOwnerInput
    extensions?: ExtensionUncheckedCreateNestedManyWithoutAuthorInput
    userExtensions?: UserExtensionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSettingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
  }

  export type UserUpsertWithoutSettingsInput = {
    update: XOR<UserUpdateWithoutSettingsInput, UserUncheckedUpdateWithoutSettingsInput>
    create: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSettingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSettingsInput, UserUncheckedUpdateWithoutSettingsInput>
  }

  export type UserUpdateWithoutSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspaces?: WorkspaceUpdateManyWithoutOwnerNestedInput
    extensions?: ExtensionUpdateManyWithoutAuthorNestedInput
    userExtensions?: UserExtensionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workspaces?: WorkspaceUncheckedUpdateManyWithoutOwnerNestedInput
    extensions?: ExtensionUncheckedUpdateManyWithoutAuthorNestedInput
    userExtensions?: UserExtensionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type WorkspaceCreateWithoutSettingsInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutWorkspacesInput
    editorState?: EditorStateCreateNestedOneWithoutWorkspaceInput
    secrets?: WorkspaceSecretCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutSettingsInput = {
    id?: string
    name: string
    description?: string | null
    ownerId: string
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    editorState?: EditorStateUncheckedCreateNestedOneWithoutWorkspaceInput
    secrets?: WorkspaceSecretUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutSettingsInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutSettingsInput, WorkspaceUncheckedCreateWithoutSettingsInput>
  }

  export type WorkspaceUpsertWithoutSettingsInput = {
    update: XOR<WorkspaceUpdateWithoutSettingsInput, WorkspaceUncheckedUpdateWithoutSettingsInput>
    create: XOR<WorkspaceCreateWithoutSettingsInput, WorkspaceUncheckedCreateWithoutSettingsInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutSettingsInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutSettingsInput, WorkspaceUncheckedUpdateWithoutSettingsInput>
  }

  export type WorkspaceUpdateWithoutSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutWorkspacesNestedInput
    editorState?: EditorStateUpdateOneWithoutWorkspaceNestedInput
    secrets?: WorkspaceSecretUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    editorState?: EditorStateUncheckedUpdateOneWithoutWorkspaceNestedInput
    secrets?: WorkspaceSecretUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceCreateWithoutEditorStateInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutWorkspacesInput
    settings?: WorkspaceSettingsCreateNestedOneWithoutWorkspaceInput
    secrets?: WorkspaceSecretCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutEditorStateInput = {
    id?: string
    name: string
    description?: string | null
    ownerId: string
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    settings?: WorkspaceSettingsUncheckedCreateNestedOneWithoutWorkspaceInput
    secrets?: WorkspaceSecretUncheckedCreateNestedManyWithoutWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutEditorStateInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutEditorStateInput, WorkspaceUncheckedCreateWithoutEditorStateInput>
  }

  export type TabStateCreateWithoutEditorStateInput = {
    id?: string
    path: string
    title: string
    isDirty?: boolean
    isActive?: boolean
    cursorLine?: number
    cursorColumn?: number
    scrollTop?: number
  }

  export type TabStateUncheckedCreateWithoutEditorStateInput = {
    id?: string
    path: string
    title: string
    isDirty?: boolean
    isActive?: boolean
    cursorLine?: number
    cursorColumn?: number
    scrollTop?: number
  }

  export type TabStateCreateOrConnectWithoutEditorStateInput = {
    where: TabStateWhereUniqueInput
    create: XOR<TabStateCreateWithoutEditorStateInput, TabStateUncheckedCreateWithoutEditorStateInput>
  }

  export type TabStateCreateManyEditorStateInputEnvelope = {
    data: TabStateCreateManyEditorStateInput | TabStateCreateManyEditorStateInput[]
  }

  export type WorkspaceUpsertWithoutEditorStateInput = {
    update: XOR<WorkspaceUpdateWithoutEditorStateInput, WorkspaceUncheckedUpdateWithoutEditorStateInput>
    create: XOR<WorkspaceCreateWithoutEditorStateInput, WorkspaceUncheckedCreateWithoutEditorStateInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutEditorStateInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutEditorStateInput, WorkspaceUncheckedUpdateWithoutEditorStateInput>
  }

  export type WorkspaceUpdateWithoutEditorStateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutWorkspacesNestedInput
    settings?: WorkspaceSettingsUpdateOneWithoutWorkspaceNestedInput
    secrets?: WorkspaceSecretUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutEditorStateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: StringFieldUpdateOperationsInput | string
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: WorkspaceSettingsUncheckedUpdateOneWithoutWorkspaceNestedInput
    secrets?: WorkspaceSecretUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type TabStateUpsertWithWhereUniqueWithoutEditorStateInput = {
    where: TabStateWhereUniqueInput
    update: XOR<TabStateUpdateWithoutEditorStateInput, TabStateUncheckedUpdateWithoutEditorStateInput>
    create: XOR<TabStateCreateWithoutEditorStateInput, TabStateUncheckedCreateWithoutEditorStateInput>
  }

  export type TabStateUpdateWithWhereUniqueWithoutEditorStateInput = {
    where: TabStateWhereUniqueInput
    data: XOR<TabStateUpdateWithoutEditorStateInput, TabStateUncheckedUpdateWithoutEditorStateInput>
  }

  export type TabStateUpdateManyWithWhereWithoutEditorStateInput = {
    where: TabStateScalarWhereInput
    data: XOR<TabStateUpdateManyMutationInput, TabStateUncheckedUpdateManyWithoutEditorStateInput>
  }

  export type TabStateScalarWhereInput = {
    AND?: TabStateScalarWhereInput | TabStateScalarWhereInput[]
    OR?: TabStateScalarWhereInput[]
    NOT?: TabStateScalarWhereInput | TabStateScalarWhereInput[]
    id?: StringFilter<"TabState"> | string
    editorStateId?: StringFilter<"TabState"> | string
    path?: StringFilter<"TabState"> | string
    title?: StringFilter<"TabState"> | string
    isDirty?: BoolFilter<"TabState"> | boolean
    isActive?: BoolFilter<"TabState"> | boolean
    cursorLine?: IntFilter<"TabState"> | number
    cursorColumn?: IntFilter<"TabState"> | number
    scrollTop?: IntFilter<"TabState"> | number
  }

  export type EditorStateCreateWithoutTabsInput = {
    activeTabId?: string | null
    lastSaved?: Date | string | null
    workspace: WorkspaceCreateNestedOneWithoutEditorStateInput
  }

  export type EditorStateUncheckedCreateWithoutTabsInput = {
    workspaceId: string
    activeTabId?: string | null
    lastSaved?: Date | string | null
  }

  export type EditorStateCreateOrConnectWithoutTabsInput = {
    where: EditorStateWhereUniqueInput
    create: XOR<EditorStateCreateWithoutTabsInput, EditorStateUncheckedCreateWithoutTabsInput>
  }

  export type EditorStateUpsertWithoutTabsInput = {
    update: XOR<EditorStateUpdateWithoutTabsInput, EditorStateUncheckedUpdateWithoutTabsInput>
    create: XOR<EditorStateCreateWithoutTabsInput, EditorStateUncheckedCreateWithoutTabsInput>
    where?: EditorStateWhereInput
  }

  export type EditorStateUpdateToOneWithWhereWithoutTabsInput = {
    where?: EditorStateWhereInput
    data: XOR<EditorStateUpdateWithoutTabsInput, EditorStateUncheckedUpdateWithoutTabsInput>
  }

  export type EditorStateUpdateWithoutTabsInput = {
    activeTabId?: NullableStringFieldUpdateOperationsInput | string | null
    lastSaved?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    workspace?: WorkspaceUpdateOneRequiredWithoutEditorStateNestedInput
  }

  export type EditorStateUncheckedUpdateWithoutTabsInput = {
    workspaceId?: StringFieldUpdateOperationsInput | string
    activeTabId?: NullableStringFieldUpdateOperationsInput | string | null
    lastSaved?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WorkspaceCreateManyOwnerInput = {
    id?: string
    name: string
    description?: string | null
    isPublic?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExtensionCreateManyAuthorInput = {
    id?: string
    name: string
    description?: string | null
    gitUrl?: string | null
    gitBranch?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    active?: boolean
    installedVersionId?: string | null
  }

  export type UserExtensionCreateManyUserInput = {
    id?: string
    extensionId: string
    installedVersionId: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: WorkspaceSettingsUpdateOneWithoutWorkspaceNestedInput
    editorState?: EditorStateUpdateOneWithoutWorkspaceNestedInput
    secrets?: WorkspaceSecretUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: WorkspaceSettingsUncheckedUpdateOneWithoutWorkspaceNestedInput
    editorState?: EditorStateUncheckedUpdateOneWithoutWorkspaceNestedInput
    secrets?: WorkspaceSecretUncheckedUpdateManyWithoutWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtensionUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    gitUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gitBranch?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    installedVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    versions?: ExtensionVersionUpdateManyWithoutExtensionNestedInput
    installations?: UserExtensionUpdateManyWithoutExtensionNestedInput
  }

  export type ExtensionUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    gitUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gitBranch?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    installedVersionId?: NullableStringFieldUpdateOperationsInput | string | null
    versions?: ExtensionVersionUncheckedUpdateManyWithoutExtensionNestedInput
    installations?: UserExtensionUncheckedUpdateManyWithoutExtensionNestedInput
  }

  export type ExtensionUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    gitUrl?: NullableStringFieldUpdateOperationsInput | string | null
    gitBranch?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    active?: BoolFieldUpdateOperationsInput | boolean
    installedVersionId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserExtensionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    extension?: ExtensionUpdateOneRequiredWithoutInstallationsNestedInput
    installedVersion?: ExtensionVersionUpdateOneRequiredWithoutInstallationsNestedInput
  }

  export type UserExtensionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    extensionId?: StringFieldUpdateOperationsInput | string
    installedVersionId?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserExtensionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    extensionId?: StringFieldUpdateOperationsInput | string
    installedVersionId?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExtensionVersionCreateManyExtensionInput = {
    id?: string
    version: string
    gitUrl: string
    gitBranch?: string
    status?: string
    buildLogs?: string
    entryPointUrl?: string | null
    createdAt?: Date | string
  }

  export type UserExtensionCreateManyExtensionInput = {
    id?: string
    userId: string
    installedVersionId: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExtensionVersionUpdateWithoutExtensionInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    gitUrl?: StringFieldUpdateOperationsInput | string
    gitBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    buildLogs?: StringFieldUpdateOperationsInput | string
    entryPointUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    installations?: UserExtensionUpdateManyWithoutInstalledVersionNestedInput
  }

  export type ExtensionVersionUncheckedUpdateWithoutExtensionInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    gitUrl?: StringFieldUpdateOperationsInput | string
    gitBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    buildLogs?: StringFieldUpdateOperationsInput | string
    entryPointUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    installations?: UserExtensionUncheckedUpdateManyWithoutInstalledVersionNestedInput
  }

  export type ExtensionVersionUncheckedUpdateManyWithoutExtensionInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    gitUrl?: StringFieldUpdateOperationsInput | string
    gitBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    buildLogs?: StringFieldUpdateOperationsInput | string
    entryPointUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserExtensionUpdateWithoutExtensionInput = {
    id?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserExtensionsNestedInput
    installedVersion?: ExtensionVersionUpdateOneRequiredWithoutInstallationsNestedInput
  }

  export type UserExtensionUncheckedUpdateWithoutExtensionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    installedVersionId?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserExtensionUncheckedUpdateManyWithoutExtensionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    installedVersionId?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserExtensionCreateManyInstalledVersionInput = {
    id?: string
    userId: string
    extensionId: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserExtensionUpdateWithoutInstalledVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserExtensionsNestedInput
    extension?: ExtensionUpdateOneRequiredWithoutInstallationsNestedInput
  }

  export type UserExtensionUncheckedUpdateWithoutInstalledVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    extensionId?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserExtensionUncheckedUpdateManyWithoutInstalledVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    extensionId?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceSecretCreateManyWorkspaceInput = {
    id?: string
    key: string
    value: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkspaceSecretUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceSecretUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkspaceSecretUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TabStateCreateManyEditorStateInput = {
    id?: string
    path: string
    title: string
    isDirty?: boolean
    isActive?: boolean
    cursorLine?: number
    cursorColumn?: number
    scrollTop?: number
  }

  export type TabStateUpdateWithoutEditorStateInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    isDirty?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    cursorLine?: IntFieldUpdateOperationsInput | number
    cursorColumn?: IntFieldUpdateOperationsInput | number
    scrollTop?: IntFieldUpdateOperationsInput | number
  }

  export type TabStateUncheckedUpdateWithoutEditorStateInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    isDirty?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    cursorLine?: IntFieldUpdateOperationsInput | number
    cursorColumn?: IntFieldUpdateOperationsInput | number
    scrollTop?: IntFieldUpdateOperationsInput | number
  }

  export type TabStateUncheckedUpdateManyWithoutEditorStateInput = {
    id?: StringFieldUpdateOperationsInput | string
    path?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    isDirty?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    cursorLine?: IntFieldUpdateOperationsInput | number
    cursorColumn?: IntFieldUpdateOperationsInput | number
    scrollTop?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}