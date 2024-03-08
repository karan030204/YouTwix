// ---------------------- Promises ----------------------
const asyncHandler = (requestHandler) => {
    (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch(err=>next(err))
    }
}


// const asyncHandler = () => {}
// const asyncHandler = (func) => {async ()=>{}}
//Interesting High Order function - as a parameter bhi accept krte h aur return bhi krte h


// ----------------- Try Catch ---------------------
//Wrapper function - try catch
// const asyncHandler = (fn) => async (req,res,next) => {
//     try {
        
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success : false,
//             message : err.message
//         })
//     }
// }

export {asyncHandler}
