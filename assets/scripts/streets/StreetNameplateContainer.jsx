import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import StreetName from './StreetName'
import StreetMeta from './StreetMeta'
import { saveStreetName } from '../store/actions/street'
import './StreetNameplateContainer.scss'

function StreetNameplateContainer (props) {
  const visible = useSelector((state) => state.ui.streetNameplateVisible)
  const editable = useSelector(
    (state) => !state.app.readOnly && state.flags.EDIT_STREET_NAME.value
  )
  const streetName = useSelector((state) => state.street.name)
  const dispatch = useDispatch()
  const intl = useIntl()
  const streetNameEl = useRef(null)
  const lastSentCoords = useRef(null)
  const [rightMenuBarLeftPos, setRightMenuBarLeftPos] = useState(0)
  const [streetNameCoords, setStreetNameCoords] = useState({
    left: 0,
    width: 0
  })

  useEffect(() => {
    window.addEventListener('resize', updateCoords)
    window.addEventListener('stmx:menu_bar_resized', updatePositions)
    window.dispatchEvent(new CustomEvent('stmx:streetnameplate_mounted'))
    return () => {
      window.removeEventListener('resize', updateCoords)
      window.removeEventListener('stmx:menu_bar_resized', updatePositions)
    }
  })

  const updateCoords = useCallback(() => {
    const rect = streetNameEl.current.getBoundingClientRect()
    const coords = {
      left: rect.left,
      width: rect.width
    }

    if (
      !lastSentCoords.current ||
      coords.left !== lastSentCoords.current.left ||
      coords.width !== lastSentCoords.current.width
    ) {
      lastSentCoords.current = coords
      handleResizeStreetName(coords)
    }
  }, [])

  // Only update coords when something affects the size of the nameplate,
  // prevents excessive cascading renders
  useEffect(() => {
    updateCoords()
  }, [streetName, updateCoords])

  function handleResizeStreetName (coords) {
    setStreetNameCoords({
      left: coords.left,
      width: coords.width
    })
  }

  function updatePositions (event) {
    if (event.detail && event.detail.rightMenuBarLeftPos) {
      setRightMenuBarLeftPos(event.detail.rightMenuBarLeftPos)
    }
  }

  function determineClassNames () {
    const classNames = ['street-nameplate-container']
    if (streetNameCoords.left + streetNameCoords.width > rightMenuBarLeftPos) {
      classNames.push('move-down-for-menu')
    }
    if (!visible) {
      classNames.push('hidden')
    }
    return classNames
  }

  function handleClickStreetName () {
    if (!editable) return

    const newName = window.prompt(
      intl.formatMessage({
        id: 'prompt.new-street',
        defaultMessage: 'New street name:'
      }),
      streetName ||
        intl.formatMessage({
          id: 'street.default-name',
          defaultMessage: 'Unnamed St'
        })
    )

    if (newName) {
      dispatch(saveStreetName(newName, true))
    }
  }

  return (
    <div className={determineClassNames().join(' ')}>
      <StreetName
        id="street-name"
        editable={editable}
        childRef={streetNameEl}
        name={streetName}
        onClick={handleClickStreetName}
      />
      <StreetMeta />
    </div>
  )
}

export default StreetNameplateContainer
