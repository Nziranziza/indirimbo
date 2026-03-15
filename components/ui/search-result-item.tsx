import { ThemedText } from '@/components/themed-text';
import { HighlightedText } from '@/components/ui/highlighted-text';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import { getPlaylistName } from '@/constants/playlists';
import type { Song } from '@/constants/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SearchResultItemProps {
  readonly playlist: string;
  readonly song: Song;
  readonly snippet: { label: string; snippet: string } | null;
  readonly query: string;
  readonly onPress: (playlist: string, songNumber: number | string) => void;
  readonly colors: { icon: string; tint: string; text: string };
}

export const SearchResultItem = React.memo(function SearchResultItem({
  playlist,
  song,
  snippet,
  query,
  onPress,
  colors,
}: SearchResultItemProps) {
  const playlistTitle = getPlaylistName(playlist);
  return (
    <TouchableOpacity
      style={[styles.songCard, { borderColor: colors.icon + '20' }]}
      onPress={() => onPress(playlist, song.number)}
      activeOpacity={0.7}>
      <View style={styles.songCardContent}>
        <View style={styles.songCardTop}>
          <SongNumberBadge number={song.number} />
          <View style={styles.songInfo}>
            <ThemedText style={[styles.playlistLabel, { color: colors.icon, opacity: 0.7 }]}>
              {playlistTitle}
            </ThemedText>
            <HighlightedText
              text={song.name}
              query={query}
              highlightColor={colors.tint}
              textColor={colors.text}
            />
          </View>
        </View>
        {snippet && (
          <View style={[styles.snippetContainer, { backgroundColor: colors.icon + '08' }]}>
            <ThemedText style={[styles.snippetLabel, { color: colors.tint }]}>
              {snippet.label}
            </ThemedText>
            <Text style={styles.snippetText} numberOfLines={3}>
              <HighlightedText
                text={snippet.snippet}
                query={query}
                highlightColor={colors.tint}
                textColor={colors.icon}
              />
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  songCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  songCardContent: {
    gap: 10,
  },
  songCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  songInfo: {
    flex: 1,
  },
  playlistLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  snippetContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  snippetLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  snippetText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
