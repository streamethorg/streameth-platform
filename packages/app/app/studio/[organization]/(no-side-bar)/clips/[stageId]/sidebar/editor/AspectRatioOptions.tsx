import { useClipPageContext } from '../../ClipPageContext';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { SmartphoneIcon, SquareIcon, TvIcon } from 'lucide-react';

const AspectRatioOptions = () => {
  const { setAspectRatio, aspectRatio } = useClipPageContext();



  const handleAspectRatioSelect = (ratio: string) => {
    setAspectRatio(ratio);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Format</Label>
      </div>

      <div className="flex flex-row w-min border border-gray-200 rounded-xl divide-x divide-gray-200">
        {/* 1:1 Square Format */}
        <div
          className={`flex flex-col items-center justify-center px-3 py-2 hover:bg-gray-100 transition-colors ${
            aspectRatio === '1:1'
              ? 'text-gray-900 bg-gray-100'
              : 'text-gray-400'
          }`}
          onClick={() => handleAspectRatioSelect('1:1')}
        >
          <SquareIcon className="w-6 h-6" />
          <Label className="text-xs mt-1">1:1</Label>
        </div>

        {/* 16:9 Landscape Format */}
        <div
          className={`flex flex-col items-center justify-center px-3 py-2 hover:bg-gray-100 transition-colors ${
            aspectRatio === '16:9'
              ? 'text-gray-900 bg-gray-100'
              : 'text-gray-400'
          }`}
          onClick={() => handleAspectRatioSelect('16:9')}
        >
          <TvIcon className="w-6 h-6" />
          <Label className="text-xs mt-1">16:9</Label>
        </div>

        {/* 9:16 Portrait Format */}
        <div
          className={`flex flex-col items-center justify-center px-3 py-2 hover:bg-gray-100 transition-colors ${
            aspectRatio === '9:16'
              ? 'text-gray-900 bg-gray-100'
              : 'text-gray-400'
          }`}
          onClick={() => handleAspectRatioSelect('9:16')}
        >
          <SmartphoneIcon className="w-6 h-6" />
          <Label className="text-xs mt-1">9:16</Label>
        </div>
      </div>
    </div>
  );
};

export default AspectRatioOptions;
