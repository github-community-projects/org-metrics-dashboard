import { useState } from "react"
import { Popover } from 'react-tiny-popover'
import { Box, Label} from '@primer/react'

const TopicCell = ({topics, isSelected}: {
  topics: string[]
  isSelected: boolean
}) => {
  const [isHovering, setIsHovering] = useState(false)
  const isOpen = topics.length > 0 && (isHovering || isSelected)

  return (
    <Popover isOpen={isOpen} content={() => {
      return (
        <Box
          className="shadow-xl min-w-64 p-4 rounded space-x-2"
          onClick={(e) => e.stopPropagation()}
          sx={{
            backgroundColor: 'Background',
            border: '1px solid',
            borderColor: 'border.default',
          }}
        >
          {topics.sort().map((topic) => <Label variant="accent" key={topic}>{topic}</Label>)}
        </Box>
      )
    }}>
      <span
        style={{ textOverflow: 'ellipsis' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="space-x-1 m-1"
      >
        {topics.sort().map((topic) => <Label sx={{backgroundColor: 'Background'}} key={topic}>{topic}</Label>)}
      </span>
    </Popover>
  )
}

export default TopicCell