export const data = {
  data: {
    users: [
      {
        name: 'Davide',
        addresses: [
          {
            zip: '12345'
          },
          {
            zip: '54321'
          }
        ],
        status: {
          enabled: true
        }
      },
      {
        name: 'Mario',
        addresses: [
          {
            zip: '12345'
          },
          {
            zip: '54321'
          }
        ],
        status: {
          enabled: true
        }
      }
    ]
  },
  extensions: {
    explain: {
      profiler: {
        data: [
          {
            path: 'users',
            begin: 2180524057777125,
            end: 2180524359067041,
            time: 301289916
          },
          {
            path: 'users.0.addresses',
            begin: 2180524359216958,
            end: 2180524480481083,
            time: 121264125
          },
          {
            path: 'users.1.addresses',
            begin: 2180524359351708,
            end: 2180524480591458,
            time: 121239750
          },
          {
            path: 'users.0.status',
            begin: 2180524359295541,
            end: 2180524560765875,
            time: 201470334
          },
          {
            path: 'users.1.status',
            begin: 2180524359356041,
            end: 2180524560907916,
            time: 201551875
          }
        ]
      }
    }
  }
}

export const simplifiedData = {
  data: {
    users: [
      {
        name: 'Davide',
        addresses: [
          {
            zip: '12345'
          },
          {
            zip: '54321'
          }
        ],
        status: {
          enabled: true
        }
      },
      {
        name: 'Mario',
        addresses: [
          {
            zip: '12345'
          },
          {
            zip: '54321'
          }
        ],
        status: {
          enabled: true
        }
      }
    ]
  },
  extensions: {
    explain: {
      profiler: {
        data: [
          {
            path: 'users',
            begin: 1,
            end: 2,
            time: 1
          },
          {
            path: 'users.0.addresses',
            begin: 3,
            end: 4,
            time: 1
          },
          {
            path: 'users.1.addresses',
            begin: 2,
            end: 4,
            time: 2
          },
          {
            path: 'users.0.status',
            begin: 2,
            end: 3,
            time: 1
          },
          {
            path: 'users.1.status',
            begin: 2,
            end: 5,
            time: 3
          }
        ]
      }
    }
  }
}

export const gqlp = {
  operationName: '',
  query: `{
  users {
    name
    addresses {
      zip
    }
    status {
      enabled
    }
  }
}`
}
