export const bulkString = [''];

const isEnum = (object) => {
  return (
    Object.keys(object).length == 2 &&
    Object.hasOwn(object, 'name') &&
    Object.hasOwn(object, 'description')
  );
};

const removeNullValues = (object, index, objects) => {
  if (typeof object === 'object' && !Array.isArray(object)) {
    for (let key in object) {
      if (
        object[key] == null ||
        object[key] == undefined ||
        object[key] == ''
      ) {
        delete object[key];
      } else if (isEnum(object[key])) {
        object[key] = object[key].name;
      } else if (Array.isArray(object[key])) {
        object[key].map((o, i, os) => {
          removeNullValues(o, i, os);
        });
      } else if (
        typeof object[key] == 'object' &&
        !Array.isArray(object[key])
      ) {
        removeNullValues(object[key], index, objects);
      }
      if (index && objects) {
        objects.splice(index, 1, object);
      }
    }
  } else if (Array.isArray(object)) {
    object.map((o, i, os) => {
      removeNullValues(o, i, os);
    });
    if (index && objects) {
      objects.splice(index, 1, object);
    }
  }
};

const bulkObjectData = (key, objectData) => {
  for (let attribute in objectData) {
    if (
      typeof objectData[attribute] == 'object' &&
      !Array.isArray(objectData[attribute])
    ) {
      bulkObjectData(`${key}.${attribute}`, objectData[attribute]);
    } else if (Array.isArray(objectData[attribute])) {
      bulkArrayData(`${key}.${attribute}`, objectData[attribute]);
    } else {
      bulkString[0] +=
        bulkString[0].length == 0
          ? `${key}.${attribute}:${objectData[attribute]}\n`
          : `\n${key}.${attribute}:${objectData[attribute]}`;
    }
  }
};

const bulkArrayData = (key, arrayData) => {
  for (let i = 0; i < arrayData.length; i++) {
    if (Array.isArray(arrayData[i])) {
      bulkArrayData(`${key}[${i}]`, arrayData[i]);
    } else if (
      typeof arrayData[i] == 'object' &&
      !Array.isArray(arrayData[i])
    ) {
      bulkObjectData(`${key}[${i}]`, arrayData[i]);
    } else {
      bulkString[0] +=
        bulkString[0].length == 0
          ? `${key}[${i}]:${arrayData[i]}\n`
          : `\n${key}[${i}]:${arrayData[i]}`;
    }
  }
};

export const bulkData = (object) => {
  bulkString[0] = '';
  removeNullValues(object);
  for (let key in object) {
    if (Array.isArray(object[key])) {
      bulkArrayData(key, object[key]);
    } else if (typeof object[key] == 'object' && !Array.isArray(object[key])) {
      bulkObjectData(key, object[key]);
    } else {
      bulkString[0] +=
        bulkString[0].length == 0
          ? `${key}:${object[key]}`
          : `\n${key}:${object[key]}`;
    }
  }
  return bulkString[0];
};
