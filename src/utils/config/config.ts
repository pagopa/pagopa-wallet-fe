/**
 * Config module
 *
 * Single point of access for the application configuration. Handles validation on required environment variables.
 * The configuration is evaluate eagerly at the first access to the module. The module exposes convenient methods to access such value.
 */

import * as t from "io-ts";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { NonEmptyString } from "@pagopa/ts-commons/lib/strings";
import { readableReport } from "@pagopa/ts-commons/lib/reporters";

export type IConfig = t.TypeOf<typeof IConfig>;
export const IConfig = t.interface({
  CHECKOUT_API_TIMEOUT: t.number,
  CHECKOUT_API_ECOMMERCE_BASEPATH: NonEmptyString,
  CHECKOUT_ECOMMERCE_HOST: NonEmptyString,
  CHECKOUT_PAGOPA_APIM_HOST: NonEmptyString,
  CHECKOUT_PAGOPA_ASSETS_CDN: NonEmptyString,
  WALLET_ENV: NonEmptyString,
});

// No need to re-evaluate this object for each call
const errorOrConfig: t.Validation<IConfig> = IConfig.decode({
  // eslint-disable-next-line no-underscore-dangle
  ...(window as any)._env_,
  CHECKOUT_API_TIMEOUT: parseInt(
    // eslint-disable-next-line no-underscore-dangle
    (window as any)._env_.CHECKOUT_API_TIMEOUT,
    10
  ),
});

/**
 * Read the application configuration and check for invalid values.
 * Configuration is eagerly evalued when the application starts.
 *
 * @returns either the configuration values or a list of validation errors
 */
export function getConfig(): t.Validation<IConfig> {
  return errorOrConfig;
}

/**
 * Read the application configuration and check for invalid values.
 * If the application is not valid, raises an exception.
 *
 * @returns the configuration values
 * @throws validation errors found while parsing the application configuration
 */
export function getConfigOrThrow(): IConfig {
  return pipe(
    errorOrConfig,
    E.getOrElseW((errors) => {
      throw new Error(`Invalid configuration: ${readableReport(errors)}`);
    })
  );
}
