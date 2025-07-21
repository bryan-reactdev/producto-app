// front/src/components/GroupPickerModal.js
import React, { useState, useEffect } from 'react'
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { SPACING, FONT_SIZES, BORDER_WIDTH, BORDER_RADIUS, COLORS } from '../StyleConstants'
import GroupRow from './GroupRow'
import useGroups from '../hooks/useGroups'
import ErrorMessage from './ErrorMessage'

export default function GroupPickerModal({ visible, onClose, onSelect }) {
  const { groups, areGroupsLoading, groupsError } = useGroups();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredGroups = groups ? groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  useEffect(() => {
    if (!visible) setSearchQuery("");
  }, [visible]);

  const handleSelect = (item) => {
    setSearchQuery("");
    onSelect(item);
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        onPress={() => { setSearchQuery(""); onClose(); }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContent}
          onPress={e => e.stopPropagation && e.stopPropagation()}
        >
          <Text style={styles.title}>Select Group</Text>
          
          <TextInput
            style={styles.searchBar}
            placeholder="Search groups..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {areGroupsLoading ? (
            <Text style={{ color: COLORS.textPrimary }}>Loading...</Text>
          ) : groupsError ? (
            <ErrorMessage message={groupsError} />
          ) : (
            <FlatList
              style={styles.groupRowList}
              data={filteredGroups}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
              renderItem={({ item }) => (
                <GroupRow
                  name={item.name}
                  count={item.count}
                  onPress={() => handleSelect(item)}
                  hideIcon
                />
              )}
            />
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={() => { setSearchQuery(""); onClose(); }}>
            <Text style={styles.cancelButtonText}>Close</Text>
          </TouchableOpacity>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '70%',

    backgroundColor: COLORS.backgroundPrimary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.base,
  },
  title: {
    marginBottom: SPACING.sm,

    includeFontPadding:false,
    fontFamily:'secondary-bold',
    fontSize: FONT_SIZES.lg,

    color: COLORS.textPrimary,
  },
  searchBar: {
    borderWidth: BORDER_WIDTH.sm,
    borderColor: COLORS.borderPrimary,
    borderRadius: BORDER_RADIUS.base,

    padding: SPACING.xs,
    marginBottom: SPACING.sm,

    fontFamily:'secondary-regular',

    color: COLORS.textPrimary,
    backgroundColor: COLORS.backgroundSecondary,
  },
  cancelButton:{
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    width:100,
    height:50,
    borderWidth:BORDER_WIDTH.sm,
    borderRadius: BORDER_RADIUS.lg,
    borderColor:COLORS.borderSecondary,
    backgroundColor:COLORS.buttonSecondary,
    alignSelf: 'flex-end',
    marginTop: SPACING.sm,
    padding: SPACING.xs,
  },
  cancelButtonText:{
    includeFontPadding:false,
    fontFamily:'secondary-regular',
    color:COLORS.textSecondary,
    fontSize: FONT_SIZES.base,
  },
}) 