import fs from 'fs';
import loki from 'lokijs';

const db = new loki('DB');
const facilities = db.addCollection('facilities', {
  indices: ['id'],
  unique: ['id'],
  exact: ['name', 'address', 'size'],
  transactional: true
});

const defaultSourcePath = './data.json';

// In-memory DB, auto index increment not available
let nextId = 0;

export default {
  init() {
    const rawJson = fs.readFileSync(defaultSourcePath, 'utf8');
    const records = JSON.parse(rawJson);
    records.forEach((record: { id: string; name: string; address: string; size: string }) => facilities.insert(record));
    nextId = records[records.length - 1].id + 1;
  },
  create(input: { name: string; address: string; size: string }) {
    const newFacility = facilities.insert({ id: nextId, ...input });
    // No built-in way of incrementing ids
    nextId++;
    return newFacility;
  },
  update(facility: {
    id: number;
    name?: string;
    address?: string;
    size?: string;
  }): { success: boolean; updated?: object } {
    const target = facilities.get(facility.id);

    if (target) {
      const updated = facilities.update({ ...target, ...facility });
      return { success: true, updated };
    }
    return { success: false };
  },
  delete(id: number): boolean {
    const target = facilities.get(id);
    if (target) {
      const result = facilities.remove(target);
      return !!result;
    } else {
      return false;
    }
  },
  get(id: number) {
    return facilities.get(id);
  },
  list(arg: { filter: string; offset: number; limit: number; sizeFilter: string[] }) {
    const { filter, sizeFilter, offset, limit } = arg;

    const query = facilities.chain();
    let total;
    const conditions = {};

    if (filter) {
      const regex = new RegExp(filter, 'i');
      conditions['$or'] = [{ name: { $regex: regex } }, { address: { $regex: regex } }];
    }

    if (sizeFilter && sizeFilter.length > 0) {
      conditions['$and'] = [{ size: { $containsAny: sizeFilter } }];
    }

    if (Object.keys(conditions).length) {
      query.find(conditions);
      total = facilities
        .chain()
        .find(conditions)
        .count();
    } else {
      total = facilities.count();
    }

    const items = query
      .offset(offset)
      .limit(limit)
      .data();

    return {
      items,
      total,
      offset,
      limit
    };
  }
};
