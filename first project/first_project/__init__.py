"""
Package for first_project.
"""
try:
    import pymysql
    pymysql.version_info = (2, 2, 1, "final", 0)
    pymysql.install_as_MySQLdb()
except ImportError:
    pass

try:
    import MySQLdb
    MySQLdb.__version__ = '2.2.1'
    MySQLdb.version_info = (2, 2, 1, 'final', 0)
except Exception:
    pass


