# Application.py is the entry point for our web application 'Dining Workforce Schedule Mnagement'.
# This acts as an interface between client and server. Python lask framework is implemented to communicate with database.
# MYSql queries are used in these functions to fetch and store data from/to database respectively
from flask import Flask, session, render_template, request, json, flash, redirect, url_for, make_response
from flaskext.mysql import MySQL
from datetime import date, time, datetime 

mysql = MySQL()
app = Flask(__name__,static_url_path="", static_folder="templates")
app.secret_key = 'random string'
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'oracle'
app.config['MYSQL_DATABASE_DB'] = 'EmpData'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)
#transaction lock; mutex lock; overwrite the data; create a transaction log in a separate text file; constant querying management;
# main function which is called when application is run
@app.route("/")
def main():
    return render_template('SU_Home.html')

# function to display student login page
@app.route("/showSignUp_student")
def showSignUp_student():
    return render_template('Login_Student.html')

# function to display supervisor login page
@app.route("/showSignUp_supervisor")
def showSignUp_supervisor():
    return render_template('Login_Supervisor.html')

# function to display student dashboard after successful login    
@app.route("/dashboard_student")
def dashboard_student(username):
    if not session.get('logged_in'):
        return render_template('Login_Student.html')
    else:
        cursor = mysql.connect().cursor()
        cursor.execute("select diningName from DiningHalls where diningName in ( select userWorkPlace from User where netID = '"+username+"')")
        dining_hall = cursor.fetchall();
        cursor.execute("select userName from User where netID = '"+username+"'")
        name = cursor.fetchall();
        for row in dining_hall:
            diningHall = row[0];
        for row in name:
            user_name = row[0]; 
        print(diningHall)
        print(user_name)
        return render_template('DashBoard.html',variable=user_name,variable1=diningHall)

# function to display supervisor dashboard after successful login  
@app.route("/dashboard_supervisor")
def dashboard_supervisor(username):
    if not session.get('logged_in'):
        return render_template('Login_Supervisor.html')
    else:
        return render_template('DashBoardSupervisor.html')

# function to authenticate student  
@app.route("/AuthenticateStudent")
def AuthenticateStudent():
    username = request.args.get('uname')
    password = request.args.get('psw')
    cursor = mysql.connect().cursor()
    cursor.execute("SELECT * from User where netID='" + username + "' and userPassword='" + password + "' and userDesignation='Student'")
    data = cursor.fetchone()
    if data is None:
        flash("Username or Password is wrong")
        return redirect(url_for('showSignUp_student'))
    else:
        session['logged_in'] = True;
        return dashboard_student(username)

# function to authenticate supervisor  
@app.route("/AuthenticateSupervisor")
def AuthenticateSupervisor():
    username = request.args.get('uname')
    password = request.args.get('psw')
    cursor = mysql.connect().cursor()
    cursor.execute("SELECT * from User where netID='" + username + "' and userPassword='" + password + "' and userDesignation='Supervisor'")
    data = cursor.fetchone()
    if data is None:
        flash("Username or Password is wrong")
        return redirect(url_for('showSignUp_supervisor'))
    else:
        session['logged_in'] = True;
        return dashboard_student(username)

# function to display current schedule of the student/supervisor of logged in user  
@app.route("/MySchedule")   
def mySchedule():
    cursor = mysql.connect().cursor()
    username = "apmahaja"
    cursor.execute("select A_date,WorkingFrom,workingto from permanentsubschedule_b where netid='"+username+"' and openShift='N';")
    myschedule = cursor.fetchall(); 
    json_data = []

    for result in myschedule:
        date = result[0].isoformat()
        workingFrom_hours, workingFrom_mins = result[1].seconds//3600, (result[1].seconds//60)%60
        workingTo_hours, workingTo_mins = result[2].seconds//3600, (result[2].seconds//60)%60

        data = {
                'start': str(date) + " " + str(workingFrom_hours) +":"+ str(workingFrom_mins),
                'end': str(date) + " " + str(workingTo_hours) +":"+ str(workingTo_mins),
                'color': "#D44500",
            }
        json_data.append(data)

    js= json.dumps(json_data)
    response = make_response(js)
    response.headers['Content-Type']='application/json'
    
    return response

# function to display current schedule of the student/supervisor of logged in user 
@app.route("/AvailableShifts")   
def availableShifts():
    cursor = mysql.connect().cursor()
    username = "apmahaja"
    cursor.execute("select A_date,WorkingFrom,workingto from permanentsubschedule_b where openShift='Y';")
    myschedule = cursor.fetchall(); 
    json_data = []

    cursor.execute("select userName from User where netID = '"+username+"'")
    name = cursor.fetchall();
    for row in name:
        user_name = row[0]; 

    for result in myschedule:
        date = result[0].isoformat()
        workingFrom_hours, workingFrom_mins = result[1].seconds//3600, (result[1].seconds//60)%60
        workingTo_hours, workingTo_mins = result[2].seconds//3600, (result[2].seconds//60)%60

        data = {
                'title': "Available Shift",
                'start': str(date) + " " + str(workingFrom_hours) +":"+ str(workingFrom_mins),
                'end': str(date) + " " + str(workingTo_hours) +":"+ str(workingTo_mins),
                'color': "#009900",
                'author' : user_name,
                'netID' : username
            }
        json_data.append(data)

    js= json.dumps(json_data)
    response = make_response(js)
    response.headers['Content-Type']='application/json'
    
    return response

# function when particular shift is picked by some user
@app.route("/PickShift", methods = ['POST'])   
def PickShift():
    cursor = mysql.connect().cursor()
    username = "apmahaja"
    date = ""
    startTime = ""
    endTime = ""
    cursor.execute("update permanentsubschedule_b SET OpenShift='N', netId = 'apmahaja' WHERE A_date='2018-05-10' and netId = 'apmahaja';")
    cursor.execute("commit;")
    js= json.dumps({'Status' : 'OK'})
    response = make_response(js)
    response.headers['Content-Type']='application/json'
    
    return response

# function when particular shift is sub by logged in user
@app.route("/SubShift", methods = ['POST'])   
def SubShift():
    cursor = mysql.connect().cursor()
    username = "apmahaja"
    date = ""
    startTime = ""
    endTime = ""
    cursor.execute("update permanentsubschedule_b SET OpenShift='Y' WHERE A_date='2018-05-31' and netId = '"+username+"';")
    cursor.execute("commit;")
    js= json.dumps({'Status' : 'OK'})
    response = make_response(js)
    response.headers['Content-Type']='application/json'
    
    return response

@app.route("/logout")
def logout():
    session.pop('logged_in',None)
    return redirect(url_for('main'))
    
if __name__ == "__main__":
    app.run()
