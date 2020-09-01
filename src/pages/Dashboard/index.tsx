import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import {
  format,
  isToday,
  isTomorrow,
  isAfter,
  isWeekend,
  isSaturday,
  addDays,
} from 'date-fns';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
import { parseISO } from 'date-fns/esm';
import { Link } from 'react-router-dom';
import {
  Container,
  Header,
  HeaderContainer,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import avatarPlaceholder from '../../assets/avatar-placeholder.png';
import { useToast } from '../../hooks/toast';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hour_formatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();

    if (isWeekend(today)) {
      return isSaturday(today) ? addDays(today, 2) : addDays(today, 1);
    }

    return today;
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();
  const { addToast } = useToast();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<Appointment[]>('appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(
        response => {
          const formattedAppointments = response.data.map(appointment => {
            return {
              ...appointment,
              hour_formatted: format(parseISO(appointment.date), 'HH:mm'),
            };
          });

          setAppointments(formattedAppointments);
        },
        err => {
          addToast({
            type: 'error',
            title: 'Unable to load server data',
            description:
              'An error ocorrered, please check your network connection and try again',
          });
        },
      );
  }, [selectedDate, addToast]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, 'MMMM dd');
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc');
  }, [selectedDate]);

  const unavailableDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => !monthDay.available)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [monthAvailability, currentMonth]);

  const selectedToday = useMemo(() => {
    if (isToday(selectedDate)) {
      return <span>Today</span>;
    }

    if (isTomorrow(selectedDate)) {
      return <span>Tomorrow</span>;
    }

    return undefined;
  }, [selectedDate]);

  return (
    <Container>
      <Header>
        <HeaderContainer>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img
              src={user.avatar_url ? user.avatar_url : avatarPlaceholder}
              alt={user.name}
            />
            <div>
              <span>Welcome,</span>
              <Link to="/profile">{user.name}</Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContainer>
      </Header>

      <Content>
        <Schedule>
          <h1>Scheduled Appointments</h1>
          <p>
            {selectedToday && selectedToday}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Next appointment</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />

                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hour_formatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Morning</strong>

            {morningAppointments.length === 0 && (
              <p>No appointments for this morning</p>
            )}

            {morningAppointments.map(appointment => {
              return (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hour_formatted}
                  </span>
                  <div>
                    <img
                      src={appointment.user.avatar_url}
                      alt={appointment.user.name}
                    />

                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              );
            })}
          </Section>

          <Section>
            <strong>Afternoon</strong>

            {afternoonAppointments.length === 0 && (
              <p>No appointments for this afternoon</p>
            )}

            {afternoonAppointments.map(appointment => {
              return (
                <Appointment key={appointment.id}>
                  <span>
                    <FiClock />
                    {appointment.hour_formatted}
                  </span>
                  <div>
                    <img
                      src={appointment.user.avatar_url}
                      alt={appointment.user.name}
                    />

                    <strong>{appointment.user.name}</strong>
                  </div>
                </Appointment>
              );
            })}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, { before: new Date() }]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
              unavailable: [...unavailableDays],
            }}
            selectedDays={selectedDate}
            onDayClick={handleDateChange}
            onMonthChange={handleMonthChange}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
