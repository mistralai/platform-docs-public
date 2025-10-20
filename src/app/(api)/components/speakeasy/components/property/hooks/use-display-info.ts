import { useMemo } from 'react';
import {
  computeMultilineTypeLabel,
  computeSingleLineDisplayType,
} from '@/app/(api)/util/displayType';
import { DisplayTypeInfo } from '@/app/(api)/types/shared';

export type DisplayInfo = {
  multiline: boolean;
  contents: string;
  singleLineDisplay?: string;
  singleLineMeasure?: string;
};

export function useDisplayInfo({
  typeInfo,
  offscreenTextSizeMeasureContainerWidth,
  offscreenTypeMeasureContainerWidth,
  titleContainerWidth,
  titlePrefixContainerWidth,
}: {
  typeInfo: DisplayTypeInfo | undefined;
  offscreenTextSizeMeasureContainerWidth: number;
  offscreenTypeMeasureContainerWidth: number;
  titleContainerWidth: number;
  titlePrefixContainerWidth: number;
}): DisplayInfo | undefined {
  const displayInfo = useMemo(() => {
    if (!typeInfo) {
      return;
    }

    const { display: singleLineDisplay, measure: singleLineMeasure } =
      computeSingleLineDisplayType(typeInfo);
    // If the value is 0, that means we haven't rendered yet and don't know the
    // width. In this case, we just don't render the type at all.
    if (offscreenTextSizeMeasureContainerWidth === 0) {
      return {
        multiline: false,
        contents: '',
      };
    }

    // Determine if we need to show this in two lines, based on the width of the
    // the measured single line type
    const multiline =
      offscreenTypeMeasureContainerWidth >
      titleContainerWidth - titlePrefixContainerWidth;

    // If the measured width is 0, that means we're running on the server in which
    // case we want to render content on a single line. We only need maxCharacters
    // in the multiline case, so we don't need to consider the title width when
    // computing max characters.
    const maxMultilineCharacters =
      titleContainerWidth === 0 || offscreenTextSizeMeasureContainerWidth === 0
        ? Infinity
        : // We subtract 4 here to account for the padding on the left and right
          Math.floor(
            titleContainerWidth / offscreenTextSizeMeasureContainerWidth
          ) - 4;

    // Finally, if we are multiline, compute the multiline type label, otherwise
    // we can reuse the single line version we already computed
    const contents = multiline
      ? computeMultilineTypeLabel(typeInfo, 0, maxMultilineCharacters).contents
      : singleLineDisplay;

    return {
      multiline,
      contents,
      singleLineDisplay,
      singleLineMeasure,
    };
  }, [
    offscreenTextSizeMeasureContainerWidth,
    offscreenTypeMeasureContainerWidth,
    titleContainerWidth,
    titlePrefixContainerWidth,
    typeInfo,
  ]);

  return displayInfo;
}
