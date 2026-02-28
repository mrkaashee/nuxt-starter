export { default as orm } from '#server/db/orm'

export const escapeKey = (key: string) => String(key).replace(/\W/g, '')
