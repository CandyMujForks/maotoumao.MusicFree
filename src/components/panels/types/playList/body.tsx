import React, {useCallback, useMemo, useRef} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import rpx from '@/utils/rpx';
import Tag from '@/components/base/tag';
import ThemeText from '@/components/base/themeText';
import {fontSizeConst} from '@/constants/uiConst';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {isSameMediaItem} from '@/utils/mediaItem';
import IconButton from '@/components/base/iconButton';
import Loading from '@/components/base/loading';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useColors from '@/hooks/useColors';
import TrackPlayer from '@/core/trackPlayer';
import {FlashList} from '@shopify/flash-list';

const ITEM_HEIGHT = rpx(108);
const ITEM_WIDTH = rpx(750);

interface IPlayListProps {
    item: IMusic.IMusicItem;
    isCurrentMusic: boolean;
}

function _PlayListItem(props: IPlayListProps) {
    const colors = useColors();
    const {item, isCurrentMusic} = props;

    return (
        <Pressable
            onPress={() => {
                TrackPlayer.play(item);
            }}
            style={style.musicItem}>
            {isCurrentMusic && (
                <Icon
                    name="music"
                    color={colors.textHighlight ?? colors.primary}
                    size={fontSizeConst.content}
                    style={style.currentPlaying}
                />
            )}
            <ThemeText
                style={[
                    style.musicItemTitle,
                    {
                        color: isCurrentMusic
                            ? colors.textHighlight ?? colors.primary
                            : colors.text,
                    },
                ]}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {item.title}
                <Text style={{fontSize: fontSizeConst.description}}>
                    {' '}
                    - {item.artist}
                </Text>
            </ThemeText>
            <Tag tagName={item.platform} />
            <IconButton
                style={{marginLeft: rpx(14)}}
                name="close"
                sizeType="small"
                onPress={() => {
                    TrackPlayer.remove(item);
                }}
            />
        </Pressable>
    );
}

const PlayListItem = React.memo(
    _PlayListItem,
    (prev, next) =>
        !!isSameMediaItem(prev.item, next.item) &&
        prev.isCurrentMusic === next.isCurrentMusic,
);

interface IBodyProps {
    loading?: boolean;
}
export default function Body(props: IBodyProps) {
    const {loading} = props;
    const playList = TrackPlayer.usePlayList();
    const currentMusicItem = TrackPlayer.useCurrentMusic();
    const listRef = useRef<FlashList<IMusic.IMusicItem> | null>();
    const safeAreaInsets = useSafeAreaInsets();

    const initIndex = useMemo(() => {
        const id = playList.findIndex(_ =>
            isSameMediaItem(currentMusicItem, _),
        );

        if (id !== -1) {
            return id;
        }
        return undefined;
    }, []);

    const renderItem = useCallback(
        ({item}: {item: IMusic.IMusicItem; index: number}) => {
            return (
                <PlayListItem
                    item={item}
                    isCurrentMusic={!!isSameMediaItem(item, currentMusicItem)}
                />
            );
        },
        [currentMusicItem],
    );

    return loading ? (
        <Loading />
    ) : (
        <View
            style={[
                style.playList,
                {
                    paddingBottom: safeAreaInsets.bottom,
                },
            ]}>
            <FlashList
                ref={_ => {
                    listRef.current = _;
                }}
                estimatedItemSize={ITEM_HEIGHT}
                data={playList}
                initialScrollIndex={initIndex}
                renderItem={renderItem}
            />
        </View>
    );
}

const style = StyleSheet.create({
    playList: {
        width: rpx(750),
        flex: 1,
    },
    currentPlaying: {
        marginRight: rpx(6),
    },
    musicItem: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        paddingHorizontal: rpx(24),
        flexDirection: 'row',
        alignItems: 'center',
    },
    musicItemTitle: {
        flex: 1,
    },
});
