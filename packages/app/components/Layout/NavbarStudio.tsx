import React from 'react';
import Image from 'next/image';
import SearchBar from '@/components/misc/SearchBar';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { IExtendedOrganization } from '@/lib/types';
import UserProfile from '@/components/misc/UserProfile';
import CreateLivestreamModal from '@/app/studio/[organization]/(root)/livestreams/components/CreateLivestreamModal';
import UploadVideoDialog from '@/app/studio/[organization]/(root)/library/components/UploadVideoDialog';
import FeatureButton from '../ui/feature-button';
import { Radio, FileUp } from 'lucide-react';
import { isFeatureAvailable } from '@/lib/utils/utils';
import { notFound } from 'next/navigation';

const NavbarStudio = ({
  showSearchBar = true,
  organizations,
  currentOrganization,
}: {
  logo?: string;
  showLogo?: boolean;
  showSearchBar?: boolean;
  organizations?: IExtendedOrganization[];
  currentOrganization?: string;
}) => {
  const organization = organizations?.find(
    (org) => org?.slug?.toString() === currentOrganization
  );

  if (!organization) {
    return notFound();
  }

  const hasValidSubscription = isFeatureAvailable(organization.expirationDate);
  const hasReachedStageLimit = (organization.currentStages ?? 0) >= (organization.paidStages ?? 0);

  return (
    <NavigationMenu className="h-[72px] w-full  sticky top-0 flex items-center p-2 px-4 bg-white md:hidden lg:flex z-[30]">
      <Image
        src={'/logo_dark.png'}
        alt="Logo"
        width={230}
        height={50}
        className="hidden lg:block"
      />
      <div className="flex flex-grow justify-center items-center">
        <SearchBar
          searchVisible={showSearchBar}
          organizationId={organization._id.toString()}
          organizationSlug={organization?.slug ?? ''}
          isStudio={true}
        />
      </div>
      <div className="flex items-center justify-end space-x-2">
        {hasValidSubscription ? (
          hasReachedStageLimit ? (
            <FeatureButton
              organizationId={organization._id.toString()}
              variant="outline"
              className="flex items-center gap-2"
              forceLockedState={true}
            >
              <Radio className="w-5 h-5" />
              Create Livestream
            </FeatureButton>
          ) : (
            <CreateLivestreamModal
              variant="outline"
              organization={organization}
            />
          )
        ) : (
          <FeatureButton
            organizationId={organization._id.toString()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Radio className="w-5 h-5" />
            Create Livestream
          </FeatureButton>
        )}
        {hasValidSubscription ? (
          <UploadVideoDialog organizationId={organization._id.toString()} />
        ) : (
          <FeatureButton
            organizationId={organization._id.toString()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileUp className="w-5 h-5" />
            Upload Video
          </FeatureButton>
        )}
        {organizations && (
          <UserProfile
            organization={organization._id}
            organizations={organizations}
          />
        )}
      </div>
    </NavigationMenu>
  );
};

export default NavbarStudio;
