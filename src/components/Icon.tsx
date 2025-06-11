import React from 'react';
import { ViewProps } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../styles/globalStyles';

export type IconName =
  | 'check'
  | 'fire'
  | 'heart'
  | 'thumb-up'
  | 'celebration';

interface IconProps extends ViewProps {
  name: IconName;
  size?: number;
  color?: string;
}

/**
 * Simple wrapper around Expo vector icons. This allows us to swap the icon
 * set in a single place while keeping a clean API across the code-base.
 */
const Icon: React.FC<IconProps> = ({ name, size = 20, color = COLORS.text.primary, style, ...rest }) => {
  switch (name) {
    case 'check':
      return <MaterialIcons name="check" size={size} color={color} style={style} {...rest} />;
    case 'fire':
      return <MaterialCommunityIcons name="fire" size={size} color={color} style={style} {...rest} />;
    case 'heart':
      return <MaterialIcons name="favorite" size={size} color={color} style={style} {...rest} />;
    case 'thumb-up':
      return <MaterialIcons name="thumb-up" size={size} color={color} style={style} {...rest} />;
    case 'celebration':
      return <MaterialIcons name="celebration" size={size} color={color} style={style} {...rest} />;
    default:
      return <MaterialIcons name="help-outline" size={size} color={color} style={style} {...rest} />;
  }
};

export default Icon; 