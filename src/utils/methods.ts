import { camelize, camelizeKeys } from './camelize';

export type TMode = 'flatten' | 'mapping';
export type TObject = Record<string, string | number | boolean | null | object>;
type TBasic = string | number | boolean;

interface IResourceObjectProps {
  id: string;
  type: string;
}

interface IRelationshipsProps {
  [key: string]: {
    data: IResourceObjectProps | IResourceObjectProps[] | null;
  } | undefined;
}

interface IAttributesProps {
  [key: string]: TBasic | TBasic[] | null | TObject | TObject[] | undefined;
}

export interface IExtractDataReturnProps {
  id: string;
  relationships: {
    [key: string]: IResourceObjectProps | IResourceObjectProps[];
  };
  [key: string]: string | TObject;
}

type TExtractDataReturn<T extends TMode> = T extends 'mapping' ? IExtractDataReturnProps : TObject;

export interface IDataProps extends IResourceObjectProps {
  attributes: IAttributesProps;
  relationships?: IRelationshipsProps;
}

const extractResourceObjects = (
  data: IResourceObjectProps | IResourceObjectProps[],
): string | string[] => {
  if (Array.isArray(data)) {
    return data.map((datumn) => datumn.id);
  }

  return data.id;
};

export function extractData<T extends TMode = 'flatten'>(data: IDataProps, mode?: T): TExtractDataReturn<T> {
  const modeType = mode || 'flatten';
  const { id, attributes, relationships } = data;
  const result = {
    id,
    ...attributes,
  };
  const extractedRelationships = extractRelationships(relationships, mode);

  if (modeType === 'flatten') {
    Object.assign(result, extractedRelationships);
  } else {
    Object.assign(result, {
      relationships: extractedRelationships,
    });
  }

  return camelizeKeys(result);
}

const extractRelationships = (data: IRelationshipsProps = {}, mode: TMode = 'flatten'): TObject => {
  return Object.entries(data).reduce((result, [k, v]) => {
    if (!v?.data) {
      return result;
    }

    const camelizedKey = camelize(k);

    if (mode === 'flatten') {
      result[camelizedKey] = extractResourceObjects(v.data);
    } else {
      result[camelizedKey] = v.data;
    }

    return result;
  }, {} as Record<string, string | string[] | object | object[]>);
};

export const extractIncluded = (data: IDataProps[] = [], mode: TMode = 'flatten'): Record<string, Record<string, TObject>> => {
  return data.reduce((result, resource) => {
    const { id, type } = resource;
    const datumn = extractData(resource, mode);
    const camelizedType = camelize(type);

    if (result[camelizedType]) {
      result[camelizedType][id] = datumn;
    } else {
      result[camelizedType] = {
        [id]: datumn,
      };
    }

    return result;
  }, {} as Record<string, Record<string, TObject>>);
};
