import { Play } from '@chakra-icons/ionicons'
import { Reload } from '@chakra-icons/simple-line-icons'
import { PlayerPause } from '@chakra-icons/tabler-icons'
import { Box, CircularProgress, CircularProgressLabel, Container, Link, Stack, Text, Show, Hide } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import UseCountDown from 'react-countdown-hook'

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
    <Box>
      <Show above="md">
        <Container w="100vw" h="100vh" backgroundColor="#E5E5E5" maxW="100vw" maxH="100vh" alignItems="center" display="flex" justifyContent="center">
          <Stack w="1768px" h="956px" direction="row" justifyContent="space-between">
            <Box h="full" w="345px" textAlign="center">
              <Box flexDirection="row" display="flex" justifyContent="center" mt="240px">
                <Link onClick={() => { setWorkTime(workTime - 1) }} _hover={{ border: 'none' }}>
                  <Text color="#E53E3E" fontSize="128px">-</Text>
                </Link>
                <Box display="flex" flexDirection="column" gap="20px">
                  <Text color="black" fontSize="40px" fontWeight={700} h="0">Work Time</Text>
                  <Text fontSize="128px" ml="22px" mr="22px" textAlign="center">{workTime}</Text>
                </Box>
                <Link onClick={() => setWorkTime(workTime + 1)} _hover={{ border: 'none' }}>
                  <Text color="#E53E3E" fontSize="128px">+</Text>
                </Link>
              </Box>
            </Box>
            <Box h="full" w="500px">
              <Box flexDirection="row" display="flex" justifyContent="center">
                <Link onClick={() => setLongBreakTime(longBreakTime - 1)} _hover={{ border: 'none' }}>
                  <Text color="#E53E3E" fontSize="128px">-</Text>
                </Link>
                <Box display="flex" flexDirection="column" gap="20px">
                  <Text color="black" fontSize="40px" fontWeight={700} h="0">Long Break</Text>
                  <Text fontSize="128px" ml="22px" mr="22px" textAlign="center">{longBreakTime}</Text>
                </Box>
                <Link onClick={() => setLongBreakTime(longBreakTime + 1)} _hover={{ border: 'none' }}>
                  <Text color="#E53E3E" fontSize="128px">+</Text>
                </Link>
              </Box>
              <Box textAlign="center" mt="90px">
                <CircularProgress size="500px" thickness="2px" color="red.400" value={sec} max={60} trackColor="red.200">
                  <CircularProgressLabel>
                    <Text fontSize="128px">{notStarted ? workTime : minutes}:{seconds}</Text>
                  </CircularProgressLabel>
                </CircularProgress>
              </Box>
              <Stack direction="row" spacing="100px" justifyContent="center" alignContent="center">
                <Link _hover={{ border: 'none' }}>
                  {isRunning ? <PlayerPause onClick={() => handleResume()} fontSize="100px"/> : <Play fontSize="100px" onClick={() => handlePlay()}/>}
                </Link>
                <Link onClick={() => { (rotation === '360deg') ? setRotation('0deg') : setRotation('360deg'); reset(); setIsRunning(false); setIsPaused(false); setNotStarted(true) }}>
                  <Reload transition="0.5s" transform={`rotate(${rotation})`} fontSize="90px" color="black"/>
                </Link>
              </Stack>
            </Box>
            <Box h="full" w="345px" textAlign="center">
              <Box flexDirection="row" display="flex" justifyContent="center" mt="240px">
                <Link onClick={() => setShortBreakTime(shortBreakTime - 1)} _hover={{ border: 'none' }}>
                  <Text color="#E53E3E" fontSize="128px">-</Text>
                </Link>
                <Box display="flex" flexDirection="column">
                  <Text color="black" fontSize="40px" fontWeight={700} h="20px" whiteSpace="nowrap">Short Break</Text>
                  <Text fontSize="128px" ml="22px" mr="22px" textAlign="center">{shortBreakTime}</Text>
                </Box>
                <Link onClick={() => setShortBreakTime(shortBreakTime + 1)} _hover={{ border: 'none' }}>
                  <Text color="#E53E3E" fontSize="128px">+</Text>
                </Link>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Show>
      <Show below="md">
        <Stack h="100%" direction="row" justifyContent="center" backgroundColor="#E5E5E5" w="100%" alignItems="center">
          <Box h="100vh" w="100vw" textAlign="center">
            <Box flexDirection="row" display="flex" justifyContent="center" mt="150px">
              <Link onClick={() => { setWorkTime(workTime - 1) }} _hover={{ border: 'none' }}>
                <Text color="#E53E3E" fontSize="30px">-</Text>
              </Link>
              <Box display="flex" flexDirection="column" gap="30px">
                <Text color="black" fontSize="10px" fontWeight={700} h="0">Work Time</Text>
                <Text fontSize="30px" ml="22px" mr="22px" textAlign="center">{workTime}</Text>
              </Box>
              <Link onClick={() => setWorkTime(workTime + 1)} _hover={{ border: 'none' }}>
                <Text color="#E53E3E" fontSize="30px">+</Text>
              </Link>
            </Box>
          </Box>
          <Box h="auto" w="full">
            <Box flexDirection="row" display="flex" justifyContent="center">
              <Link onClick={() => setLongBreakTime(longBreakTime - 1)} _hover={{ border: 'none' }}>
                <Text color="#E53E3E" fontSize="30px">-</Text>
              </Link>
              <Box display="flex" flexDirection="column" gap="30px">
                <Text color="black" fontSize="10px" fontWeight={700} h="0">Long Break</Text>
                <Text fontSize="30px" ml="22px" mr="22px" textAlign="center">{longBreakTime}</Text>
              </Box>
              <Link onClick={() => setLongBreakTime(longBreakTime + 1)} _hover={{ border: 'none' }}>
                <Text color="#E53E3E" fontSize="30px">+</Text>
              </Link>
            </Box>
            <Box textAlign="center" mt="40px">
              <CircularProgress size="170px" thickness="2px" color="red.400" value={sec} max={60} trackColor="red.200">
                <CircularProgressLabel>
                  <Text fontSize="30px">{notStarted ? workTime : minutes}:{seconds}</Text>
                </CircularProgressLabel>
              </CircularProgress>
            </Box>
            <Stack direction="row" spacing="50px" justifyContent="center" alignContent="center" alignItems="center" mt="75px">
              <Link _hover={{ border: 'none' }}>
                {isRunning ? <PlayerPause onClick={() => handleResume()} fontSize="50px"/> : <Play fontSize="50px" onClick={() => handlePlay()}/>}
              </Link>
              <Link onClick={() => { (rotation === '360deg') ? setRotation('0deg') : setRotation('360deg'); reset(); setIsRunning(false); setIsPaused(false); setNotStarted(true) }}>
                <Reload transition="0.5s" transform={`rotate(${rotation})`} fontSize="43px" color="black"/>
              </Link>
            </Stack>
          </Box>
          <Box h="844px" w="vw" textAlign="center">
            <Box flexDirection="row" display="flex" mt="150px" mb="644px">
              <Link onClick={() => setShortBreakTime(shortBreakTime - 1)} _hover={{ border: 'none' }}>
                <Text color="#E53E3E" fontSize="30px">-</Text>
              </Link>
              <Box display="flex" flexDirection="column">
                <Text color="black" fontSize="10px" fontWeight={700} h="30px" whiteSpace="nowrap">Short Break</Text>
                <Text fontSize="30px" ml="22px" mr="22px" textAlign="center">{shortBreakTime}</Text>
              </Box>
              <Link onClick={() => setShortBreakTime(shortBreakTime + 1)} _hover={{ border: 'none' }}>
                <Text color="#E53E3E" fontSize="30px">+</Text>
              </Link>
            </Box>
          </Box>
        </Stack>
      </Show>
    </Box>
  )
}

export default App
