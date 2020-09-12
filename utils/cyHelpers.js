const TYPE_MAP = {
  vertex: "nodes",
  edge: "edges"
};
const FIELD_MAP = {
  _id: "id",
  _from: "source",
  _to: "target"
};

export function rg2cy(data) {
  const result = {};

  for (const el of data) {
    const key = TYPE_MAP[el.type];
    result[key] = [];
    for (const node of el.nodes) {
      const item = {};
      for (const k in node) {
        item[FIELD_MAP[k] || k] = node[k];
      }
      result[key].push({ data: item });
    }
  }

  return result;
}