interface Entity {
    id: string | number;
    [key: string]: any;
  }
  
  interface NormalizedData<T extends Entity> {
    entities: { [id: string]: T };
    ids: (string | number)[];
  }
  
  export function normalizeData<T extends Entity>(data: T[]): NormalizedData<T> {
    return data.reduce(
      (acc, item) => {
        acc.entities[item.id] = item;
        acc.ids.push(item.id);
        return acc;
      },
      { entities: {}, ids: [] } as NormalizedData<T>
    );
  }