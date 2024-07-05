const asyncHandler=(requestHandler) => {
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).
        catch((err)=>next(err))
    }
}

export {asyncHandler}


//requestHandler is analogous to fn
/*const asyncHandler = (fn) =>: This defines a constant asyncHandler which is assigned to an arrow function. This arrow function takes a single parameter fn, which is expected to be a function.

() => {}: This is another arrow function that is returned by the asyncHandler function. Currently, it does nothing as it contains an empty function body {}.*/

// const asyncHandler=(fn)=> async (req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code||500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }