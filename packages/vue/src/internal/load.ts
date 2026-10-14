import type { Component } from 'vue'

export const load = async (entry: string, name: string): Promise<Component> => {
  const mod = await import(`@atlair/vue/${entry}`)
  return mod[name]
}
