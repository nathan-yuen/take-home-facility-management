import facilityRecords from './facilityRecords';

export default {
  Query: {
    hello(obj: any, { subject }: { subject: string }) {
      return `Hello, ${subject}! from Server`;
    },
    facilities(
      parent: any,
      args: { filter: string; size: string; offset: number; limit: number; sizeFilter: string[] }
    ) {
      return facilityRecords.list(args);
    },
    facility(parent: any, args: { id: number }) {
      return facilityRecords.get(args.id);
    }
  },
  Mutation: {
    addFacility(parent: any, args: { facility: { name: string; address: string; size: string } }) {
      return facilityRecords.create(args.facility);
    },
    removeFacility(parent: any, args: { id: number }) {
      const { id } = args;
      const success = facilityRecords.delete(id);
      return {
        success,
        message: success ? undefined : `Unable to remove facility record of ID: ${id}`
      };
    },
    updateFacility(parent: any, args: { facility: { id: number; name?: string; address?: string; size?: string } }) {
      const { facility } = args;
      const results = facilityRecords.update(facility);
      return {
        ...results,
        message: results.success ? undefined : `Unable to udpate facility record of ID: ${facility.id}`
      };
    }
  }
};
