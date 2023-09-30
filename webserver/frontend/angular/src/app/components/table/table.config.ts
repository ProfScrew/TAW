import { TableStatus } from "src/app/services/table.service"

export const TableOptions = {
    left_click: {
        [TableStatus.UNSET]: [
            { type: 'info',  text: 'Open table'  },
            { type: 'unset', text: 'Cancel' },
        ],

        [TableStatus.LOCKED]: [
            { type: 'unset', text: 'Cancel' }
        ],

        [TableStatus.RESERVED]: [
            { type: 'info',  text: 'Open table'  },
            { type: 'unset', text: 'Cancel' },
            { type: 'error', text: 'Delete' },
        ],

        [TableStatus.OCCUPIED]: [
            { type: 'info',  text: 'View order'  },
            { type: 'unset', text: 'Cancel' },
            { type: 'error', text: 'Close order' }
        ],

        [TableStatus.ORDERING]: [
            { type: 'unset', text: 'Cancel' },
        ],

        [TableStatus.WAITING]: [
            { type: 'info', text: 'View order' },
            { type: 'unset', text: 'Cancel' }
        ],

        [TableStatus.CLOSING]: [
            { type: 'unset', text: 'Cancel' }
        ]
    },

    right_click: {
        [TableStatus.UNSET]: [],
        [TableStatus.LOCKED]: [],
        [TableStatus.RESERVED]: [
            { type: 'error', text: 'Cancel reservation' }
        ],

        [TableStatus.OCCUPIED]: [],
        [TableStatus.ORDERING]: [],
        [TableStatus.WAITING]: [
            { type: 'info', text: 'View order' }
        ],

        [TableStatus.CLOSING]: [
            { type: 'info', text: 'Re-open order' }
        ]
    }
}
