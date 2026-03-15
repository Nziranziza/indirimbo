import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import { getPlaylistName } from '@/constants/playlists';
import type { Song } from '@/constants/types';
import React, { useMemo } from 'react';
import {
  Platform,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RecentSearch, RecentSong } from '@/utils/storage';

type RecentSearchItem = { type: 'search'; query: string };
type RecentSongItem = { type: 'song'; playlist: string; songNumber: number | string; songName: string };
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
        data: recentSongs.map(s => ({ type: 'song' as const, playlist: s.playlist, songNumber: s.songNumber, songName: s.songName })),
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
        { paddingBottom: bottomInset + 90 },
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
          {Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 26 && isInputFocused && (
            <ThemedText type="title" style={{ marginBottom: 20 }}>Search</ThemedText>
          )}
          <View style={styles.recentHeader}>
            <ThemedText type="defaultSemiBold" style={styles.recentTitle}>
              Recent
            </ThemedText>
            {recentSearches.length > 0 && (
              <TouchableOpacity
                onPress={onClearSearches}
                activeOpacity={0.7}
              >
                <ThemedText
                  style={[styles.clearAllText, { color: colors.tint }]}
                >
                  Clear all
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
                  borderBottomColor: colors.icon + '20',
                },
              ]}
              onPress={() => onSearchTap(item.query)}
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
        const playlistSongs = allSongs[item.playlist] || [];
        const song = playlistSongs.find(
          (s) => String(s.number) === String(item.songNumber),
        );
        return (
          <TouchableOpacity
            style={[
              styles.recentSongCard,
              { borderColor: colors.icon + '20' },
            ]}
            onPress={() => onSongPress(item.playlist, item.songNumber)}
            activeOpacity={0.7}
          >
            <SongNumberBadge number={item.songNumber} />
            <View style={styles.recentSongInfo}>
              <ThemedText
                style={[
                  styles.playlistLabel,
                  { color: colors.icon, opacity: 0.7 },
                ]}
              >
                {getPlaylistName(item.playlist)}
              </ThemedText>
              <ThemedText
                type="defaultSemiBold"
                style={styles.recentSongName}
                numberOfLines={2}
              >
                {song?.name || item.songName}
              </ThemedText>
            </View>
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={
        <ThemedView style={styles.emptyState}>
          <IconSymbol
            name="magnifyingglass"
            size={48}
            color={colors.icon + '40'}
          />
          <ThemedText style={styles.emptyTitle}>Search Songs</ThemedText>
          <ThemedText style={styles.emptyText}>
            Search across all playlists by song name, number, or lyrics
          </ThemedText>
        </ThemedView>
      }
    />
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
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
    paddingVertical: 12,
  },
  recentQuery: {
    flex: 1,
    fontSize: 15,
  },
  recentSongCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
  },
  recentSongInfo: {
    flex: 1,
  },
  playlistLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  recentSongName: {
    fontSize: 14,
    lineHeight: 18,
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
