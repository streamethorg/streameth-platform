import { enableTailwind } from '@remotion/tailwind'
import { WebpackOverrideFn } from '@remotion/bundler'

export const webpackOverride: WebpackOverrideFn = (
  currentConfiguration
) => {
  return enableTailwind(currentConfiguration)
}
