import type { Access } from 'payload'

// Public read access. Use only for collections meant to be world-readable.
export const anyone: Access = () => true
