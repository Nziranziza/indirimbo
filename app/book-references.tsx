import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FloatingShareButton } from '@/components/ui/floating-share-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BOOKS, type BookDefinition } from '@/constants/book-names';
import { PageHead } from '@/components/page-head';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const BookCard = React.memo(function BookCard({
  item,
}: {
  readonly item: BookDefinition;
}) {
  const colors = useColors();
  return (
    <View style={[styles.card, { borderColor: colors.icon + '12' }]}>
      <View style={[styles.cardLeft, { backgroundColor: colors.tint + '10' }]}>
        <ThemedText
          style={[styles.abbreviation, { color: colors.tint }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {item.abbreviation}
        </ThemedText>
      </View>
      <View style={[styles.cardRight, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.bookName}>{item.name}</ThemedText>
      </View>
    </View>
  );
});

export default function BookReferencesScreen() {
  const colors = useColors();
  const { t } = useTranslation();

  return (
    <>
      <PageHead
        title={t('bookRefs.pageTitle')}
        description={t('bookRefs.pageDescription')}
        canonicalPath="/book-references/"
      />
      <CollapsibleHeaderScrollView
        title={t('bookRefs.title')}
        headerMaxHeight={200}
        contentGap={12}
        hasFab
        fallbackHref="/(tabs)/settings"
        headerContent={
          <View style={styles.heroSection}>
            <View
              style={[
                styles.heroIcon,
                { backgroundColor: colors.tint + '15' },
              ]}
            >
              <IconSymbol name="book.fill" size={32} color={colors.tint} />
            </View>
            <ThemedText type="title" style={styles.heroTitle}>
              {t('bookRefs.title')}
            </ThemedText>
          </View>
        }
      >
        <ThemedView
          style={[
            styles.introCard,
            {
              borderColor: colors.tint + '30',
              backgroundColor: colors.tint + '08',
            },
          ]}
        >
          <ThemedText style={styles.introText}>
            {t('bookRefs.intro')}
          </ThemedText>
        </ThemedView>

        {BOOKS.map((book) => (
          <BookCard key={book.id} item={book} />
        ))}
      </CollapsibleHeaderScrollView>
      <FloatingShareButton />
    </>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 4,
  },
  introCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  introText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardLeft: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cardRight: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  abbreviation: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bookName: {
    fontSize: 14,
    lineHeight: 20,
  },
});
