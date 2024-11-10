package com.sr.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sr.model.*;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
	@Query("SELECT t FROM Transaction t  WHERE t.transactionId = :id")
	Transaction findTransactionById(@Param("id") String id);

	
}
