import { gql } from 'apollo-boost';

export const LIST_FACILITIES = gql`
  query listFacilities($filter: String, $sizeFilter: [FacilitySize], $offset: Int, $limit: Int) {
    facilities(filter: $filter, sizeFilter: $sizeFilter, offset: $offset, limit: $limit) {
      items {
        id
        name
        address
        size
      }
      total
    }
  }
`;

export const ADD = gql`
  mutation add($facility: FacilityAddInput!) {
    addFacility(facility: $facility) {
      id
      name
    }
  }
`;

export const REMOVE = gql`
  mutation remove($id: Int!) {
    removeFacility(id: $id) {
      success
      message
    }
  }
`;

export const UPDATE = gql`
  mutation update($facility: FacilityUpdateInput!) {
    updateFacility(facility: $facility) {
      success
      message
      updated {
        id
        name
      }
    }
  }
`;
