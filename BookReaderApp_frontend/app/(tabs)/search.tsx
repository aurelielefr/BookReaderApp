'use client';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';

import { TextInput, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface Book {
    id: string;
    title: string;
    author: { name: string };
    gender: string;
}

export default function SearchScreen() {
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState<'title' | 'author' | 'gender'>('title');
    const [books, setBooks] = useState<Book[]>([]);

    const filteredBooks = books.filter((book) => {
        const searchLower = searchText.toLowerCase();
        
        switch (filterType) {
            case 'title':
                return book.title.toLowerCase().includes(searchLower);
            case 'author':
                return book.author.name.toLowerCase().includes(searchLower);
            case 'gender':
                return book.gender.toLowerCase().includes(searchLower);
            default:
                return true;
        }
    });

    const renderBook = ({ item }: { item: Book }) => (
        <ThemedView style={styles.bookItem}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
            <ThemedText style={styles.author}>By: {item.author.name}</ThemedText>
            <ThemedText style={styles.gender}>Genre: {item.gender}</ThemedText>
        </ThemedView>
    );

    return (
        <SafeAreaView style={{ flex: 2 }} edges={['top']}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Search</ThemedText>
            </ThemedView>
            <ThemedView style={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    placeholder={`Search by ${filterType}...`}
                    value={searchText}
                    onChangeText={setSearchText}
                />
                
                <ThemedView style={styles.filterContainer}>
                    {(['title', 'author', 'gender'] as const).map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.filterBtn, filterType === type && styles.activeFilter]}
                            onPress={() => setFilterType(type)}
                        >
                            <ThemedText style={styles.filterText}>{type}</ThemedText>
                        </TouchableOpacity>
                    ))}
                </ThemedView>

                <FlatList
                    data={filteredBooks}
                    renderItem={renderBook}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={<ThemedText style={styles.empty}>No books found</ThemedText>}
                    scrollEnabled={false}
                    nestedScrollEnabled={false}
                />
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {flexDirection: 'row',alignItems: 'center',gap: 8,},
    container: { flex: 1, padding: 16 },
    searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 16 },
    filterContainer: { flexDirection: 'row', marginBottom: 16, gap: 8 },
    filterBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#e0e0e0' },
    activeFilter: { backgroundColor: '#007AFF' },
    filterText: { color: '#000', fontWeight: '500' },
    bookItem: { padding: 12, marginBottom: 12, backgroundColor: '#f5f5f5', borderRadius: 8 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#000' },
    author: { fontSize: 14, color: '#555', marginTop: 4 },
    gender: { fontSize: 12, color: '#888', marginTop: 4 },
    empty: { textAlign: 'center', marginTop: 20, color: '#999' },
    reactLogo: {height: 178, width: 290, bottom: 0, left: 0, position: 'absolute',},
});