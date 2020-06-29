import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
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

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    return [0, 6].includes(new Date().getDay()) ? undefined : new Date();
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available) {
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

  const disableDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => !monthDay.available)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [monthAvailability, currentMonth]);

  return (
    <Container>
      <Header>
        <HeaderContainer>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt={user.name} />
            <div>
              <span>Welcome,</span>
              <strong>{user.name}</strong>
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
            <span>Hoje</span>
            <span>Dia 6</span>
            <span>Segunda-feira</span>
          </p>

          <NextAppointment>
            <strong>Next appointment</strong>
            <div>
              <img src={user.avatar_url} alt={user.name} />

              <strong>{user.name}</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>
          <Section>
            <strong>Morning</strong>

            <Appointment>
              <span>
                <FiClock />
                8:00
              </span>
              <div>
                <img src={user.avatar_url} alt={user.name} />

                <strong>{user.name}</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                8:00
              </span>
              <div>
                <img src={user.avatar_url} alt={user.name} />

                <strong>{user.name}</strong>
              </div>
            </Appointment>
          </Section>
          <Section>
            <strong>Afternoon</strong>

            <Appointment>
              <span>
                <FiClock />
                8:00
              </span>
              <div>
                <img src={user.avatar_url} alt={user.name} />

                <strong>{user.name}</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                8:00
              </span>
              <div>
                <img src={user.avatar_url} alt={user.name} />

                <strong>{user.name}</strong>
              </div>
            </Appointment>
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['S', 'M', 'T', 'W', 'T', 'F', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disableDays]}
            modifiers={{ available: { daysOfWeek: [1, 2, 3, 4, 5] } }}
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
