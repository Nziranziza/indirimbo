import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { RecentSongCard } from '@/components/ui/recent-song-card';
import type { Song } from '@/constants/types';
import { useTranslation } from '@/hooks/use-translation';
import React, { useMemo } from 'react';
import {
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IS_IOS_26_OR_HIGHER } from '@/utils/platform';
import type { RecentSearch, RecentSong } from '@/utils/storage';

type RecentSearchItem = { type: 'search'; query: string };
type RecentSongItem = {
  type: 'song';
  playlist: string;
  songNumber: number | string;
  songName: string;
  timestamp: number;
};
type RecentItem = RecentSearchItem | RecentSongItem;

interface RecentItemsListProps {
  readonly recentSearches: RecentSearch[];
  readonly recentSongs: RecentSong[];
  readonly allSongs: Record<string, Song[]>;
  readonly colors: { icon: string; tint: string; text: string };
  readonly isInputFocused: boolean;
  readonly bottomInset: number;
  readonly onSearchTap: (query: string) => void;
  readonly onRemoveSearch: (query: string) => void;
  readonly onClearSearches: () => void;
  readonly onSongPress: (playlist: string, songNumber: number | string) => void;
}

export function RecentItemsList({
  recentSearches,
  recentSongs,
  allSongs,
  colors,
  isInputFocused,
  bottomInset,
  onSearchTap,
  onRemoveSearch,
  onClearSearches,
  onSongPress,
}: RecentItemsListProps) {
  const { t } = useTranslation();
  const recentSections = useMemo(() => {
    const sections: { key: string; title: string; data: RecentItem[] }[] = [];
    if (recentSearches.length > 0) {
      sections.push({
        key: 'searches',
        title: '',
        data: recentSearches.map(s => ({ type: 'search' as const, query: s.query })),
      });
    }
    if (recentSongs.length > 0) {
      sections.push({
        key: 'songs',
        title: '',
        data: recentSongs.map(s => ({
          type: 'song' as const,
          playlist: s.playlist,
          songNumber: s.songNumber,
          songName: s.songName,
          timestamp: s.timestamp,
        })),
      });
    }
    return sections;
  }, [recentSearches, recentSongs]);

  return (
    <SectionList
      sections={recentSections}
      keyExtractor={(item, index) =>
        `${item.type}-${item.type === 'search' ? item.query : `${item.playlist}-${item.songNumber}`}-${index}`
      }
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: 0 },
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      renderSectionHeader={() => null}
      SectionSeparatorComponent={({ trailingItem, trailingSection }) =>
        !trailingItem && trailingSection ? (
          <View style={{ height: 16 }} />
        ) : null
      }
      ListHeaderComponent={
        <>
          {IS_IOS_26_OR_HIGHER && isInputFocused && (
            <ThemedText type="title" style={{ marginBottom: 20 }}>{t('search.title')}</ThemedText>
          )}
          <View style={styles.recentHeader}>
            {(recentSearches.length > 0 || recentSongs.length > 0) && (
              <ThemedText type="defaultSemiBold" style={styles.recentTitle}>
                {t('search.recentTitle')}
              </ThemedText>
            )}
            {recentSearches.length > 0 && (
              <TouchableOpacity
                onPress={onClearSearches}
                accessibilityLabel={t('search.clearAllA11y')}
                accessibilityRole="button"
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[styles.clearAllText, { color: colors.tint }]}
                >
                  {t('search.clearAll')}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </>
      }
      renderItem={({ item, index, section }) => {
        if (item.type === 'search') {
          const isLast = index === section.data.length - 1;
          return (
            <TouchableOpacity
              style={[
                styles.recentItem,
                !isLast && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.icon + '40',
                },
              ]}
              onPress={() => onSearchTap(item.query)}
              accessibilityLabel={t('search.searchForA11y', { query: item.query })}
              accessibilityRole="button"
              activeOpacity={0.7}
            >
              <IconSymbol
                name="clock.arrow.circlepath"
                size={18}
                color={colors.icon}
              />
              <ThemedText style={styles.recentQuery} numberOfLines={1}>
                {item.query}
              </ThemedText>
              <TouchableOpacity
                onPress={() => onRemoveSearch(item.query)}
                accessibilityLabel={t('search.removeRecentA11y', { query: item.query })}
                accessibilityRole="button"
                activeOpacity={0.7}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <IconSymbol
                  name="xmark"
                  size={14}
                  color={colors.icon + '60'}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }
        return (
          <RecentSongCard
            playlist={item.playlist}
            songNumber={item.songNumber}
            songName={item.songName}
            timestamp={item.timestamp}
            allSongs={allSongs}
            onPress={onSongPress}
            style={styles.songCardSpacing}
          />
        );
      }}
      ListEmptyComponent={
        <ThemedView style={styles.emptyState}>
          <IconSymbol
            name="magnifyingglass"
            size={48}
            color={colors.icon + '40'}
          />
          <ThemedText style={styles.emptyTitle}>{t('search.searchSongsTitle')}</ThemedText>
          <ThemedText style={styles.emptyText}>
            {t('search.searchSongsHint')}
          </ThemedText>
        </ThemedView>
      }
    />
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recentTitle: {
    fontSize: 16,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  recentQuery: {
    flex: 1,
    fontSize: 15,
  },
  songCardSpacing: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    opacity: 0.8,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
