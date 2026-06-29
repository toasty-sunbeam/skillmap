import type * as Y from 'yjs';

export interface MetadataFields {
	name: string;
}

// export type MetadataMap = Y.Map<MetadataFields[keyof MetadataFields]>;
export type MetadataMap = Y.Map<string>;
