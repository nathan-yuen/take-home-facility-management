export const updateQuery = `mutation update($facility: FacilityUpdateInput!) {
    updateFacility(facility: $facility) {
      success
      message
      updated {
        id
        name
        address
        size
      }
    }
  }`;

export const removeQuery = `mutation remove($id: Int!) {
    removeFacility(id: $id) {
      success
      message
    }
  }`;

export const findQuery = `query find($id: Int!) {
    facility(id: $id) {
      id
      name
      address
      size
    }
  }`;
