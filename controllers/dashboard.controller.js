const userModel = require('../models/user.model');
const financialRecord = require('../models/records.model');
const validator = require("validator"); // for validating email


//dashboard data for user - total income, total expense, balance, category wise totals, 5 most recent records and monthly trends (only admin can view dashboard of specific user by email, analyst and viewer can only view their dashboard)
exports.getDashboard = async(req, res)=>{
    const user = req.user;
    const { email } = req.body;

    try {

        let filter = {};

        // admin will have option to view dashboard of specific user by email, analyst and viewer can only view their dashboard
        if(email){

            if(!validator.isEmail(email))
                return res.status(400).json("Invalid email!");

            const targetUser = await userModel.findOne({ email: email });
            if(!targetUser) return res.status(404).json("User not found!");

            filter = { userId: targetUser._id };
        }

        // analyst and viewer can only view their dashboard using the id they are coming with in the token
        else{
            filter = { userId: user.id };
        }

        const records = await financialRecord.find(filter);

        // if no records found for the user, return default values in response
        if(records.length === 0){
            return res.status(200).json({
                message: "No records found",
                data: {
                    totalIncome: 0,
                    totalExpense: 0,
                    balance: 0,
                    categoryTotals: {},
                    recent: [],
                    monthlyTrends: {}
                }
            });
        }

        let totalIncome = 0;
        let totalExpense = 0;
        let categoryTotals = {};
        let monthlyTrends = {};

        // iterating through records to calculate total income, total expense, balance, category wise totals and monthly trends
        records.forEach((record)=>{

            if(record.type === 'income'){
                totalIncome += record.amount;
            }
            else{
                totalExpense += record.amount;
            }

            // category
            if(!categoryTotals[record.category]){
                categoryTotals[record.category] = {
                    income: 0,
                    expense: 0
                };
            }

            if(record.type === 'income'){
                categoryTotals[record.category].income += record.amount;
            }
            else{
                categoryTotals[record.category].expense += record.amount;
            }

            // monthly trends - to get month and year from date, we can use toLocaleString method of date object
            const month = new Date(record.date).toLocaleString('default', { month: 'short', year: 'numeric' });

            if(!monthlyTrends[month]){
                monthlyTrends[month] = {
                    income: 0,
                    expense: 0
                };
            }

            // calculating monthly trends
            if(record.type === 'income'){
                monthlyTrends[month].income += record.amount;
            }
            else{
                monthlyTrends[month].expense += record.amount;
            }
        });

        // calculating balance
        const balance = totalIncome - totalExpense;

        // getting 5 most recent records by sorting the records based on createdAt field in descending order and slicing the first 5 records
        const recent = records
            .sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0,5);

            //returning the dashboard data in response
        return res.status(200).json({
            message: "Dashboard fetched successfully",
            data: {
                totalIncome,
                totalExpense,
                balance,
                categoryTotals,
                recent,
                monthlyTrends
            }
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};