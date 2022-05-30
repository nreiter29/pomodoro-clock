import { Play } from '@chakra-icons/ionicons'
import { Reload } from '@chakra-icons/simple-line-icons'
import { PlayerPause } from '@chakra-icons/tabler-icons'
import { Box, CircularProgress, CircularProgressLabel, Container, Link, Stack, Text, Show, Hide } from '@chakra-ui/react'
import type { StringOrNumber } from '@chakra-ui/utils'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import UseCountDown from 'react-countdown-hook'

const TimeControl: React.FC<{ time: number, setTime: any, headline: string, mt?: string}> = ({ time, setTime, headline, mt }) => {
  return (
    <Box textAlign="center" minW="375px">
      <Box flexDirection="row" display="flex" justifyContent="center" mt={mt}>
        <Link onClick={() => { setTime(time - 1) }} _hover={{ border: 'none' }}>
          <Text color="#E53E3E" fontSize={{ base: '60px', lg: '128px' }}>-</Text>
        </Link>
        <Box display="flex" flexDirection="column" gap="20px">
          <Text color="black" fontSize={{ base: '20px', lg: '40px' }} fontWeight={700} h="0">{headline}</Text>
          <Text fontSize={{ base: '60px', lg: '128px' }} ml={{ base: '5px', lg: '22px' }} mr={{ base: '5px', lg: '22px' }} textAlign="center">{time}</Text>
        </Box>
        <Link onClick={() => setTime(time + 1)} _hover={{ border: 'none' }}>
          <Text color="#E53E3E" fontSize={{ base: '60px', lg: '128px' }}>+</Text>
        </Link>
      </Box>
    </Box>
  )
}

const TimeCircle: React.FC<{seconds: string, sec: number, notStarted: boolean, workTime: number, minutes: number, size: StringOrNumber }> = ({ seconds, sec, notStarted, workTime, minutes, size }) => {
  return (
    <Box textAlign="center" mt={{ base: '0px', lg: '90px' }}>
      <CircularProgress size={size} thickness="2px" color="red.400" value={sec} max={60} trackColor="red.200">
        <CircularProgressLabel>
          <Text fontSize={{ base: '75px', lg: '128px' }}>{notStarted ? workTime : minutes}:{seconds}</Text>
        </CircularProgressLabel>
      </CircularProgress>
    </Box>
  )
}

const App = () => {
  const [workTime, setWorkTime] = useState(25)
  if (workTime < 1) {
    setWorkTime(1)
  } else if (workTime > 60) {
    setWorkTime(60)
  }

  const [longBreakTime, setLongBreakTime] = useState(15)
  if (longBreakTime < 0) {
    setLongBreakTime(0)
  } else if (longBreakTime > 60) {
    setLongBreakTime(60)
  }

  const [shortBreakTime, setShortBreakTime] = useState(5)
  if (shortBreakTime < 0) {
    setShortBreakTime(0)
  } else if (shortBreakTime > 60) {
    setShortBreakTime(60)
  }
  let initialTime = useMemo(() => {
    return workTime * 60 * 1000
  }, [workTime])
  const interval = 1000
  const [timeLeft, { start, pause, resume, reset }] = UseCountDown(initialTime, interval)
  const [rotation, setRotation] = useState('0deg')
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [notStarted, setNotStarted] = useState(true)
  const [timeOver, setTimeOver] = useState(false)
  const handlePlay = useCallback(() => {
    if (isRunning) {
      pause()
      setIsRunning(false)
      setIsPaused(true)
    }
    if (isPaused) {
      resume()
      setIsPaused(false)
      setIsRunning(true)
    } else {
      start(initialTime)
      setIsRunning(true)
      setIsPaused(false)
      setNotStarted(false)
    }
  }, [initialTime, start, isRunning, pause, isPaused, resume])

  const handleResume = useCallback(() => {
    pause()
    setIsPaused(true)
    setIsRunning(false)
  }, [setIsPaused, setIsRunning, pause])

  const sec = (timeLeft / 1000) % 60
  const min = (timeLeft / 1000)
  const minutes = Math.floor(min / 60)
  let seconds = sec.toString()

  if (sec < 10) {
    seconds = `0${sec.toFixed(0)}`
  }

  let [count, setCount] = useState(1)

  if (isRunning && sec === 0 && min === 0) {
    setCount(count++)
    if (count === 1) {
      initialTime = shortBreakTime * 60 * 1000
      setCount(count++)
      start(initialTime)
    } else if (count === 2) {
      initialTime = workTime * 60 * 1000
      setCount(count++)
      start(initialTime)
    } else if (count === 3) {
      initialTime = shortBreakTime * 60 * 1000
      setCount(count++)
      start(initialTime)
    } else if (count === 4) {
      initialTime = workTime * 60 * 1000
      setCount(count++)
      start(initialTime)
    } else if (count === 5) {
      initialTime = shortBreakTime * 60 * 1000
      setCount(count++)
      start(initialTime)
    } else if (count === 6) {
      initialTime = workTime * 60 * 1000
      setCount(count++)
      start(initialTime)
    } else if (count === 7) {
      initialTime = longBreakTime * 60 * 1000
      start(initialTime)
      setCount(1)
    }
  }

  return (
    <Box backgroundColor="#E5E5E5" w="100%" h="100vh">
      <Container maxW="container.xl" h="100vh" display="flex" alignItems="center" textAlign="center" justifyContent="center">
        <Show above="lg">
          <Stack direction="row" justifyContent="space-between" spacing="150px">
            <TimeControl time={workTime} setTime={setWorkTime} headline="Work Time" mt="240px"/>
            <Box>
              <TimeControl time={shortBreakTime} setTime={setShortBreakTime} headline="Short Break" mt="0px"/>
              <TimeCircle seconds={seconds} sec={sec} notStarted={notStarted} workTime={workTime} minutes={minutes} size="500px"/>
              <Stack direction="row" spacing="100px" justifyContent="center" alignContent="center">
                <Link _hover={{ border: 'none' }}>
                  {isRunning ? <PlayerPause onClick={() => handleResume()} fontSize="100px"/> : <Play fontSize="100px" onClick={() => handlePlay()}/>}
                </Link>
                <Link onClick={() => { (rotation === '360deg') ? setRotation('0deg') : setRotation('360deg'); reset(); setIsRunning(false); setIsPaused(false); setNotStarted(true) }}>
                  <Reload transition="0.5s" transform={`rotate(${rotation})`} fontSize="90px" color="black"/>
                </Link>
              </Stack>
            </Box>
            <TimeControl time={longBreakTime} setTime={setLongBreakTime} headline="Long Break" mt="240px"/>
          </Stack>
        </Show>
        <Show below="lg">
          <Stack>
            <TimeCircle seconds={seconds} sec={sec} notStarted={notStarted} workTime={workTime} minutes={minutes} size="300px"/>
            <Stack spacing="15px">
              <TimeControl time={workTime} setTime={setWorkTime} headline="Work Time"/>
              <TimeControl time={shortBreakTime} setTime={setShortBreakTime} headline="Short Break"/>
              <TimeControl time={longBreakTime} setTime={setLongBreakTime} headline="Long Break"/>
            </Stack>
            <Stack direction="row" spacing="100px" justifyContent="center" alignContent="center">
              <Link _hover={{ border: 'none' }}>
                {isRunning ? <PlayerPause onClick={() => handleResume()} fontSize="60px"/> : <Play fontSize="60px" onClick={() => handlePlay()}/>}
              </Link>
              <Link onClick={() => { (rotation === '360deg') ? setRotation('0deg') : setRotation('360deg'); reset(); setIsRunning(false); setIsPaused(false); setNotStarted(true) }}>
                <Reload transition="0.5s" transform={`rotate(${rotation})`} fontSize="50px" color="black"/>
              </Link>
            </Stack>
          </Stack>
        </Show>
      </Container>
    </Box>
  )
}

export default App
