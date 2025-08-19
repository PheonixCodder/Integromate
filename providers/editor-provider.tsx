'use client'

import { EditorActions, EditorNodeType } from '@/lib/types'
import {
  Dispatch,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react'

export type EditorNode = EditorNodeType

export type Editor = {
  elements: EditorNode[]
  edges: {
    id: string
    source: string
    target: string
  }[]
  selectedNode: EditorNodeType
}

export type HistoryState = {
  history: Editor[]
  currentIndex: number
}

export type EditorState = {
  editor: Editor
  history: HistoryState
}

const initialEditorState: EditorState['editor'] = {
  elements: [],
  selectedNode: {
    data: {
      completed: false,
      current: false,
      description: '',
      metadata: {},
      title: '',
      type: 'Trigger',
    },
    id: '',
    position: { x: 0, y: 0 },
    type: 'Trigger',
  },
  edges: [],
}

const initialHistoryState: HistoryState = {
  history: [initialEditorState],
  currentIndex: 0,
}

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
}

const editorReducer = (
  state: EditorState = initialState,
  action: EditorActions
): EditorState => {
  switch (action.type) {
    case 'REDO':
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1
        const nextEditorState = { ...state.history.history[nextIndex] }
        return {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        }
      }
      return state

    case 'UNDO':
      if (state.history.currentIndex > 0) {
        const prevIndex = state.history.currentIndex - 1
        const prevEditorState = { ...state.history.history[prevIndex] }
        return {
          ...state,
          editor: prevEditorState,
          history: {
            ...state.history,
            currentIndex: prevIndex,
          },
        }
      }
      return state

    case 'LOAD_DATA': {
      const newEditor: Editor = {
        ...state.editor,
        elements: action.payload.elements || initialEditorState.elements,
        edges: action.payload.edges,
        selectedNode: state.editor.selectedNode, // keep selection unless you want to reset
      }

      const newHistory = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        newEditor,
      ]

      return {
        ...state,
        editor: newEditor,
        history: {
          history: newHistory,
          currentIndex: newHistory.length - 1,
        },
      }
    }

    case 'SELECTED_ELEMENT':
      return {
        ...state,
        editor: {
          ...state.editor,
          selectedNode: action.payload.element,
        },
      }

    case 'UPDATE_NODES_EDGES': {
      const newEditor: Editor = {
        ...state.editor,
        elements: action.payload.elements,
        edges: action.payload.edges,
        selectedNode: state.editor.selectedNode, // preserve selection
      }

      const newHistory = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        newEditor,
      ]

      return {
        ...state,
        editor: newEditor,
        history: {
          history: newHistory,
          currentIndex: newHistory.length - 1,
        },
      }
    }

    default:
      return state
  }
}


export type EditorContextData = {
  previewMode: boolean
  setPreviewMode: (previewMode: boolean) => void
}

export const EditorContext = createContext<{
  state: EditorState
  dispatch: Dispatch<EditorActions>
}>({
  state: initialState,
  dispatch: () => undefined,
})

type EditorProps = {
  children: React.ReactNode
}

const EditorProvider = (props: EditorProps) => {
  const [state, dispatch] = useReducer(editorReducer, initialState)

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor Hook must be used within the editor Provider')
  }
  return context
}

export default EditorProvider
