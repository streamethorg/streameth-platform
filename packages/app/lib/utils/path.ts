import { IOrganizationModel } from 'streameth-new-server/src/interfaces/organization.interface';
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface';


export const archivePath = ({ organization, event, searchQuery }:{
  organization?: IOrganizationModel["slug"]
  event?: IEventModel["slug"]
  searchQuery?: string
}) => {
  const params = new URLSearchParams();

  if (organization) {
    params.append('organization', organization);
  }

  if (event) {
    params.append('event', event);
  }

  if (searchQuery) {
    params.append('searchQuery', searchQuery);
  }

  return `/archive?${params.toString()}`;
};
