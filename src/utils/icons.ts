import * as Icons from 'lucide-react';

/**
 * Dynamically resolve a Lucide icon component by name.
 * Falls back to FallbackIcon if the name is not found in the library.
 *
 * @example
 * const Icon = getDynamicIcon('Wind', Package);
 * <Icon className="w-6 h-6" />
 */
export const getDynamicIcon = (
  iconName: string | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FallbackIcon: any
): React.ElementType => {
  if (iconName && (Icons as Record<string, unknown>)[iconName]) {
    return (Icons as Record<string, React.ElementType>)[iconName];
  }
  return FallbackIcon;
};
