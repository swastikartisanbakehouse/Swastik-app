import React, { useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, BorderRadius, Spacing } from '../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
  onFilterPress?: () => void;
  style?: ViewStyle;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search cakes, milk, sweets...',
  debounceMs = 400,
  onFilterPress,
  style,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (text: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onChangeText(text);
      }, debounceMs);
    },
    [onChangeText, debounceMs],
  );

  const handleClear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onChangeText('');
  };

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.containerFocused,
        style,
      ]}
    >
      <Ionicons
        name="search"
        size={18}
        color={isFocused ? Colors.maroon : Colors.gray500}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        defaultValue={value}
        onChangeText={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel="Search products"
      />
      {value.length > 0 ? (
        <TouchableOpacity onPress={handleClear} accessibilityLabel="Clear search" style={styles.rightAction}>
          <Ionicons name="close-circle" size={18} color={Colors.gray400} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onFilterPress} accessibilityLabel="Filter options" style={styles.rightAction}>
          <Ionicons name="options-outline" size={18} color={Colors.gray600} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  containerFocused: {
    borderColor: Colors.maroon,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  rightAction: {
    paddingLeft: Spacing.xs,
  },
});
