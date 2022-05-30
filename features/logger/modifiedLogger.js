const ModifiedLogger = (resourceId) => (prevResourceOptions) => {
    const beforeFunc = async (...args) => {
      let result = await prevResourceOptions.actions.edit.before[0](...args)
      return result
    } 
    const afetrFuncReject = (...args) => {
      args[1] = {
        params: { resourceId: resourceId, action: 'reject' },
        method: 'post'
      }
      prevResourceOptions.actions.edit.after[0](...args)
      return args[0]
    } 
    const afetrFuncApprove = (...args) => {
      args[1] = {
        params: { resourceId: resourceId, action: 'approve' },
        method: 'post'
      }
      prevResourceOptions.actions.edit.after[0](...args)
      return args[0]
    }

    const newResourceOptions = {
      ...prevResourceOptions,
      actions: {
        ...prevResourceOptions.actions,
        reject: {
            ...(prevResourceOptions.actions && prevResourceOptions.actions.reject),
            before: beforeFunc,
            after: afetrFuncReject
        },
        approve: {
            ...(prevResourceOptions.actions && prevResourceOptions.actions.approve),
            before: beforeFunc,
            after: afetrFuncApprove
        }
      }
    }
    return newResourceOptions
}
  
module.exports = ModifiedLogger