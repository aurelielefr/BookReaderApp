'use client';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

const mockBooks = [
    { id: '1', title: 'Book 1', cover: require('@/assets/images/partial-react-logo.png') },
    { id: '2', title: 'Book 2', cover: require('@/assets/images/partial-react-logo.png') },
    { id: '3', title: 'Book 3', cover: require('@/assets/images/partial-react-logo.png') },
    { id: '4', title: 'Book 4', cover: require('@/assets/images/partial-react-logo.png') },
];

export default function LibraryScreen() {
    const [filter, setFilter] = useState('all');
    const [showFilter, setShowFilter] = useState(false);

    const handleFilter = (filterType: string) => {
        setFilter(filterType);
        setShowFilter(false);
    };

    const filteredBooks = filter === 'all' ? mockBooks : mockBooks.filter(book => {
        if (filter === 'recent') return book.id !== '4';
        if (filter === 'favorites') return book.id === '1' || book.id === '3';
        return true;
    });

    return (
        <SafeAreaView style={{ flex: 2 }} edges={['top']}>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.header}>
                    <ThemedText style={styles.title}>My Library</ThemedText>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={() => setShowFilter(!showFilter)}
                    >
                        <FontAwesome name="filter" size={24} color="#007AFF" />
                    </TouchableOpacity>
                </ThemedView>

                {showFilter && (
                    <ThemedView style={styles.filterMenu}>
                        <TouchableOpacity onPress={() => handleFilter('all')}>
                            <ThemedText style={styles.filterOption}>All Books</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleFilter('recent')}>
                            <ThemedText style={styles.filterOption}>Recently Read</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                )}

                <FlatList
                    data={filteredBooks}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ThemedView style={styles.bookCard}>
                            <TouchableOpacity style={styles.bookCover}>
                                <ThemedText style={styles.bookPlaceholder}>{item.title}</ThemedText>
                            </TouchableOpacity>
                            <ThemedText style={styles.bookTitle}>{item.title}</ThemedText>
                        </ThemedView>
                    )}
                    contentContainerStyle={styles.gridContainer}
                />
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    filterButton: {
        padding: 8,
    },
    filterMenu: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    filterOption: {
        paddingVertical: 10,
        fontSize: 16,
    },
    gridContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    bookCard: {
        flex: 1,
        margin: 10,
        alignItems: 'center',
    },
    bookCover: {
        width: '100%',
        aspectRatio: 0.7,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookPlaceholder: {
        textAlign: 'center',
        color: '#999',
    },
    bookTitle: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});