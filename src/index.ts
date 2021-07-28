import { camelize } from './utils/camelize';
import { extractData, extractIncluded, IDataProps, IExtractDataReturnProps, TMode, TObject } from './utils/methods';

interface IParseJsonApiParams {
  included?: IDataProps[];
  data: IDataProps | IDataProps[];
}

interface IParseJsonApiOptionsProps {
  mode?: TMode;
}

function flattenParse(data: IDataProps | IDataProps[], extractedIncluded: object): TObject {
  if (Array.isArray(data)) {
    const extractedData = data.reduce((result, resource) => {
      const { id, type } = resource;
      const datumn = extractData(resource);
      const camelizedType = camelize(type);

      if (result[camelizedType]) {
        result[camelizedType][id] = datumn;
      } else {
        result[camelizedType] = {
          [id]: datumn,
        };
      }

      return result;
    }, {} as Record<string, Record<string, object>>);

    return {
      ...extractedData,
      ...extractedIncluded,
    };
  }

  return {
    [camelize(data.type)]: extractData(data, 'flatten'),
    ...extractedIncluded,
  };
}

const mapRelation = (data: IExtractDataReturnProps['relationships'], extractedIncluded: Record<string, Record<string, TObject & IExtractDataReturnProps>>): Record<string, TObject> => {
  return Object.entries(data).reduce((result, [k, v]) => {
    if (!v) {
      return result;
    }

    let relationData;

    if (Array.isArray(v)) {
      relationData = v.reduce((result, datumn) => {
        const { id, type } = datumn;
        const camelizedType = camelize(type);
        const extractedIncludedData = extractedIncluded[camelizedType]?.[id];

        if (!extractedIncludedData) {
          return result;
        }

        const { relationships, ...relation } = extractedIncludedData;

        result.push({
          ...relation,
          ...mapRelation(relationships, extractedIncluded),
        });

        return result;
      }, [] as Record<string, string | TObject>[]);
    } else {
      const { id, type } = v;
      const camelizedType = camelize(type);
      const extractedIncludedData = extractedIncluded[camelizedType]?.[id];

      if (!extractedIncludedData) {
        return result;
      }

      const { relationships, ...relation } = extractedIncludedData;

      relationData = {
        ...relation,
        ...mapRelation(relationships, extractedIncluded),
      };
    }

    Object.assign(result, {
      [camelize(k)]: relationData,
    });

    return result;
  }, {} as Record<string, TObject>);
};

function mappingParse(data: IDataProps | IDataProps[], extractedIncluded: Record<string, Record<string, TObject>>): TObject | TObject[] {
  if (Array.isArray(data)) {
    return data.map((resource) => {
      const { relationships, ...datumn } = extractData(resource, 'mapping');

      return {
        ...datumn,
        ...mapRelation(relationships, extractedIncluded as Record<string, Record<string, TObject & IExtractDataReturnProps>>),
      };
    });
  }

  const { relationships, ...datumn } = extractData(data, 'mapping');

  return {
    ...datumn,
    ...mapRelation(relationships, extractedIncluded as Record<string, Record<string, TObject & IExtractDataReturnProps>>),
  };
}

const methods = {
  flatten: flattenParse,
  mapping: mappingParse,
} as const;

function parseJsonApi<T extends any>(
  {
    data,
    included,
  }: IParseJsonApiParams,
  opts: IParseJsonApiOptionsProps = {},
): T {
  const { mode = 'flatten' } = opts;
  const extractedIncluded = extractIncluded(included, mode);

  return methods[mode](data, extractedIncluded) as T;
}

export default parseJsonApi;
