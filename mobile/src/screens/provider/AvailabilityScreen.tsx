import { coreOptions } from 'core/core';
import { fs, rh, rw } from 'core/designHelpers';
import Pic from 'core/Pic';
import StyleSheetRW from 'core/StyleSheetRW';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import colors from 'res/colors';
import Header from 'src/components/Header';
import dropdown_svg from 'res/svgs/dropdown.svg';
import momentTz from 'moment-timezone';
import AppButton from 'src/components/AppButton';
import SafeAreaInsets from 'src/components/SafeAreaInsets';
import cloud from 'src/cloud';
import { useAppStore } from 'src/models/ReduxStore';
import navhelper from 'core/navhelper';
interface ScheduleCallScreenprops {}

// availability : { 'mon': ['10:00'] }
export default function AvailabilityScreen(props: ScheduleCallScreenprops) {
  const [selectedDaysTime, setSelectedDaysTime] = useState<{ [key: string]: string[] }>({'mon':[],'tue':[],'wed':[],'thu':[],'fri':[],'sat':[],'sun':[] });
  const [currentActiveDay, setCurrentActiveDay] = useState('sun');

 // const [selectedDate, setSelectedDate] = useState(['Mon']);
  //const [selectedTime, setSelectedTime] = useState<string>();
 // const user = useAppStore((s) => s.user);
  //const active_provider = useAppStore((s) => s.active_provider);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<Array<string>>([]);
  const provider=useAppStore((s)=>s.provider)

  useEffect(()=>{

    if (provider?.availability){
      setSelectedDaysTime({...selectedDaysTime,...JSON.parse(JSON.stringify(provider?.availability))})
    }
  },[provider?.availability])
  

  /*const onDayChanged = (value) => {
    setCurrentActiveDay(value);
		const isDayPresent = selectedDaysTime[value] != null;
    if (isDayPresent) {
			const currentDaysTime = { ...selectedDaysTime };
			delete currentDaysTime[value];
			setSelectedDaysTime(currentDaysTime);
    } else {
			const currentDaysTime = { ...selectedDaysTime };
			currentDaysTime[value] = [];
			setSelectedDaysTime(currentDaysTime);
    }
  };*/
  
	const onActiveDayChanged = (value:string) => {
		setCurrentActiveDay(value);
	}

  const onTimeChanged = (value:string) => {
    const index = selectedDaysTime[currentActiveDay].indexOf(value);
    if (index > -1) {
      const currentDaysTime = { ...selectedDaysTime };
      currentDaysTime[currentActiveDay].splice(index, 1);
      setSelectedDaysTime(currentDaysTime);
    } else {
			const currentDaysTime = { ...selectedDaysTime };
			currentDaysTime[currentActiveDay].push(value);
			setSelectedDaysTime(currentDaysTime);
    }
  };

  useEffect(() => {
    setLoading(false);

    setSlots([
      '12:00 am',
      '01:00 am',
      '02:00 am',
      '03:00 am',
      '04:00 am',
      '05:00 am',
      '06:00 am',
      '07:00 am',
      '08:00 am',
      '09:00 am',
      '10:00 am',
      '11:00 am',
      '12:00 pm',
      '01:00 pm',
      '02:00 pm',
      '03:00 pm',
      '04:00 pm',
      '05:00 pm',
      '06:00 pm',
      '07:00 pm',
      '08:00 pm',
      '09:00 pm',
      '10:00 pm',
      '11:00 pm',
    ]);

    /*setLoading(true)
        cloud.user.getSlots({date:selectedDate,timezone:momentTz.tz.guess(),provider:active_provider?.email!}).then(x=>{
            // console.log('fr3r3f ', x);


            setSlots([
"12:00 am",
"01:00 am"
            ])
         
        }).catch(()=>{

            setSlots([])
        }).finally(()=>{
            setLoading(false)
            setSelectedTime(undefined)
        })*/
  }, []);
  //console.log(selectedDaysTime)
  return (
    <>
      <Header title='Availability slots' noPadHorizontal />
      <View style={{ flex: 1 }}>
        <DaysPicker selectedDay={currentActiveDay} onChange={onActiveDayChanged} />
        {loading && (
          <View
            style={{
              marginTop: rh(10),
              marginBottom: rh(30),
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size='large' color={'black'} />
          </View>
        )}
        <Slots
          available={slots}
          loading={loading}
          selectedTimes={selectedDaysTime[currentActiveDay]}
          onChange={onTimeChanged}
        />
        <View style={{ height: rh(120) }} />
      </View>
      <View
        style={{
          position: 'absolute',
          width: rw(375),
					justifyContent: 'center',
          alignItems: 'center',
          height: rh(108) + SafeAreaInsets.BOTTOM,
          backgroundColor: '#bbd8c5',
          bottom: -SafeAreaInsets.BOTTOM,
        }}>
        <AppButton
          title='Finalize Slots'
          enabled={true}
          onPress={async () => {
            // await cloud.schedule({
            //   bookingId: user?.bookingId!,
            //   dateTimeUTC: moment(selectedDate + 'T' + selectedTime)
            //     .utc()
            //     .format('YYYY-MM-DDTHH:mm'),
            // });

            await cloud.providers.updateAvailability({availability:selectedDaysTime,timezone:momentTz.tz.guess()})
            navhelper.goBack();
          }}
        />
      </View>
    </>
  );
}
interface IDatePickerProps {
    selectedDay?: any; // 'YYYY-MM-DD'
  onChange?: (value: string) => void;
}

// availability : { 'mon': ['10:00'] }

function DaysPicker({ selectedDay, onChange }: IDatePickerProps) {
  let days = [
    { name: 'Sun', value: 'sun' },
    { name: 'Mon', value: 'mon' },
    { name: 'Tue', value: 'tue' },
    { name: 'Wed', value: 'wed' },
    { name: 'Thu', value: 'thu' },
    { name: 'Fri', value: 'fri' },
    { name: 'Sat', value: 'sat' },
   
  ];

  return (
    <View style={{ width: '100%', height: rh(120) }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {days.map((day) => {
          const isSelected = selectedDay === day.value;

          return (
            <TouchableOpacity
              key={day.value}
              style={{
                height: rh(53),
                marginRight: rw(5),
                width: rw(44),
                borderRadius: 20,
                borderWidth: 1,
                borderColor: 'rgba(51,51,51,0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isSelected ? colors.darkGreen : undefined,
              }}
              onPress={() => {
                onChange && onChange(day.value);
              }}>
              <Text
                style={{
                  fontFamily: 'Outfit',
                  fontWeight: '600',
                  fontSize: fs(14),
                  marginBottom: rh(0),
                  color: isSelected ? 'white' : colors.darkGreen,
                }}>
                {day.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

interface ISlotsProps {
  selectedTimes: string[]; //HH:mm
  onChange: (value: string) => void;
  available: Array<string>;
  loading: boolean;
}
function Slots({ selectedTimes, onChange, available, loading }: ISlotsProps) {
  const slots: Array<string> = available;

  const addMultipleSlots = (value: any) => {
		onChange(value);
  };

  let groups = [
    ['Morning', slots.slice(0, 8)],
    ['Afternoon', slots.slice(8, 16)],
    ['Evening', slots.slice(16)],
  ];

  return (
    <ScrollView
      pointerEvents={loading ? 'none' : undefined}
      style={{ opacity: loading ? 0.5 : 1 }}
      showsVerticalScrollIndicator={false}>
      {groups.map((group, i) => (
        <Collapsable
          addMultipleSlots={addMultipleSlots}
          multipleSelected={selectedTimes}
          expanded={!i}
          key={group[0]}
          name={group[0]}
          slots={group[1]}
        />
      ))}
    </ScrollView>
  );
}
function Collapsable({
  expanded,
  ...props
}: {
  expanded?: boolean;
  slots: Array<string>;
  name: string;
  selected: string;
  setSelected: any;
  multipleSelected: any;
  addMultipleSlots: any;
}) {
  // 65 : 360
  const height = useRef(new Animated.Value(expanded ? rh(360) : rh(65))).current;
  const [open, setOpen] = useState(expanded);
  return (
    <Animated.View
      style={{
        height,
        borderWidth: 1,
        width: '100%',
        paddingHorizontal: rw(20),
        marginBottom: rh(20),
        borderRadius: 20,
        borderColor: 'rgba(51,51,51,0.1)',
      }}>
      <TouchableOpacity
        style={{
          paddingVertical: rh(20),
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          borderBottomWidth: open ? 1 : 0,
          borderColor: 'rgba(51,51,51,0.1)',
        }}
        onPress={() => {
          let currentOpen = open;
          if (currentOpen) setOpen(false);
          Animated.timing(height, {
            toValue: rh(open ? 65 : 360),
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            if (!currentOpen) setOpen(true);
          });
        }}>
        <Text
          style={{
            fontFamily: 'Outfit',
            fontWeight: '600',
            fontSize: fs(14),
            color: colors.darkGreen,
          }}>
          {props.name} Slots
        </Text>
        <View>
          <Pic source={dropdown_svg} style={{ height: rh(24), width: rw(24) }} />
        </View>
      </TouchableOpacity>

      {open && (
        <>
          <View
            style={{
              borderWidth: 0,
              marginTop: rh(6),
              width: '100%',
              flex: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {props.slots.map((x) => (
              <TouchableOpacity
                onPress={() => {
                  // props.setSelected(x)
                  props.addMultipleSlots(x);
                }}
                key={x}
                style={{
                  backgroundColor: props.multipleSelected.includes(x)
                    ? colors.darkGreen
                    : 'rgba(0,0,0,0.05)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  width: rw(141),
                  height: rh(50),
                  marginBottom: rh(10),
                }}>
                {/* Here logic to select single */}
                {/* X: {x} */}

                <Text
                  style={{
                    fontFamily: 'Outfit',
                    fontWeight: '600',
                    fontSize: fs(14),
                    color: props.multipleSelected.includes(x) ? 'white' : colors.darkGreen,
                  }}>
                  {x}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text
            style={{
              fontFamily: 'Outfit',
              fontWeight: '400',
              marginVertical: rh(20),
              width: '100%',
              textAlign: 'center',
              fontSize: fs(14),
              color: colors.lightGreen,
            }}>
            All times are in {momentTz.tz.guess()}
          </Text>
        </>
      )}
    </Animated.View>
  );
}
coreOptions(AvailabilityScreen, {
  useSafeAreaView: true,
  noBottomBar: true,
  getBodyStyle: () => ({ paddingHorizontal: rw(16) }),
});
const styles = StyleSheetRW.create(() => ({}));
